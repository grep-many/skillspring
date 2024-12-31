const paypal = require("../../config/paypalConfig");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const { clientUrl } = require("../../config/envConfig");
const mongoose = require("mongoose");

// Utility to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new PayPal order
const createOrder = async (req, res) => {
    try {
        const {
            userId,
            userName,
            userEmail,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePricing,
        } = req.body;

        // Validate required fields
        if (
            !userId ||
            !userName ||
            !userEmail ||
            !instructorId ||
            !instructorName ||
            !courseId ||
            !courseTitle ||
            !coursePricing
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // Validate ObjectIds
        if (!isValidObjectId(userId) || !isValidObjectId(instructorId) || !isValidObjectId(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ObjectId provided",
            });
        }

        // PayPal payment configuration
        const create_payment_json = {
            intent: "sale",
            payer: { payment_method: "paypal" },
            redirect_urls: {
                return_url: `${clientUrl}/skillspring/payment-return`,
                cancel_url: `${clientUrl}/skillspring/payment-cancel`,
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: courseTitle,
                                sku: courseId,
                                price: coursePricing.toFixed(2),
                                currency: "USD",
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: "USD",
                        total: coursePricing.toFixed(2),
                    },
                    description: courseTitle,
                },
            ],
        };

        // Create PayPal payment
        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.error("PayPal payment creation error:", error);
                return res.status(500).json({
                    success: false,
                    message: "Error creating PayPal payment",
                });
            }

            // Save the order to the database
            const newOrder = new Order({
                userId,
                userName,
                userEmail,
                orderStatus: "pending",
                paymentMethod: "paypal",
                paymentStatus: "pending",
                orderDate: new Date(),
                paymentId: paymentInfo.id,
                instructorId,
                instructorName,
                courseImage,
                courseTitle,
                courseId,
                coursePricing,
            });

            await newOrder.save();

            // Extract approval URL
            const approveUrl = paymentInfo.links.find(link => link.rel === "approval_url").href;

            res.status(201).json({
                success: true,
                data: {
                    approveUrl,
                    orderId: newOrder._id,
                },
            });
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the order",
        });
    }
};

// Capture payment and finalize the order
const capturePaymentAndFinalizeOrder = async (req, res) => {
    const { paymentId, payerId, orderId } = req.body;
    try {

        // Validate required fields
        if (!paymentId || !payerId || !orderId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // Validate ObjectId
        if (!isValidObjectId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid orderId",
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Ensure the order hasn't already been finalized
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Order is already finalized",
            });
        }

        // Update the order
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;
        await order.save();

        // Fetch or create the StudentCourses document
        let studentCourses = await StudentCourses.findOne({ userId: order.userId });

        if (!studentCourses) {
            studentCourses = new StudentCourses({
                userId: order.userId,
                courses: [],
            });
        }

        // Check if the course is already added
        const isCourseAlreadyAdded = studentCourses.courses.some(
            (course) => course.courseId.toString() === order.courseId.toString()
        );

        if (!isCourseAlreadyAdded) {
            studentCourses.courses.push({
                courseId: order.courseId,
                title: order.courseTitle,
                instructorId: order.instructorId,
                instructorName: order.instructorName,
                dateOfPurchase: order.orderDate,
                courseImage: order.courseImage,
            });

            // Save updated student courses
            await studentCourses.save();
        }

        // Add student details to the course, ensuring no duplicate students
        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing,
                },
            },
        });

        const course = await Course.findById(order.courseId);
        if (course) {
            const uniqueStudents = [];
            const seenStudentIds = new Set();

            for (const student of course.students) {
                if (!seenStudentIds.has(student.studentId)) {
                    uniqueStudents.push(student);
                    seenStudentIds.add(student.studentId);
                }
            }

            // Update the course with deduplicated students array
            course.students = uniqueStudents;
            await course.save();
        }

        res.status(200).json({
            success: true,
            message: "Order successfully finalized",
            data: order,
        });
    } catch (error) {
        console.error("Error finalizing order:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while finalizing the order",
        });
    } finally {
        try {
            // Cleanup duplicate user entries in StudentCourses
            const uniqueCourses = StudentCourses?.courses.reduce((acc, current) => {
                const exists = acc.find(course => course.courseId.toString() === current.courseId.toString());
                if (!exists) acc.push(current);
                return acc;
            }, []);

            if (StudentCourses) {
                StudentCourses.courses = uniqueCourses;
                await StudentCourses.save();
            }

        } catch (cleanupError) {
            console.error("Error cleaning up duplicates in StudentCourses:", cleanupError);
        }
    }
};

// Cancel a pending order
const cancelPaymentAndCleanup = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Validate required fields
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        // Validate ObjectId
        if (!isValidObjectId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid orderId",
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Ensure the order is still pending
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a completed order",
            });
        }

        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            success: true,
            message: "Order successfully cancelled",
        });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while cancelling the order",
        });
    }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder, cancelPaymentAndCleanup };
