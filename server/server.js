const express = require('express');
const cors = require('cors');
const { clientUrl, port } = require('./config/envConfig');
const authRoutes = require('./routes/auth-routes/index');
const mediaRoutes = require('./routes/instructor-routes/media-routes');
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes');
const studentViewCourseRoutes = require('./routes/student-routes/course-routes');
const studentViewOrderRoutes = require('./routes/student-routes/order-routes');
const studentCoursesRoutes = require('./routes/student-routes/student-courses-routes');
const studentProgressRoutes = require('./routes/student-routes/course-progress-router');
const Order = require('./models/Order');
const StudentCourses = require('./models/StudentCourses');
require('./config/dbConfig');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: clientUrl,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.listen(port, () => console.log(`Server is running`));

// routes configuration
app.get('/', async (req, res) => {
  try {
    const currentTime = new Date();

    // Calculate the threshold for 1-day old orders
    const oneDayAgo = new Date(currentTime.getTime() - 1 * 60 * 60 * 1000);

    // Delete orders where `paymentStatus` is not "paid" and `orderDate` is older than 1 day
    const deletedOrders = await Order.deleteMany({
      paymentStatus: { $ne: "paid" }, // paymentStatus not equal to "paid"
      orderDate: { $lt: oneDayAgo }, // orderDate is older than one day
    });

    // Ensure deletedOrders is properly defined
    if (!deletedOrders || !deletedOrders.deletedCount) {
      return res.status(200).json({
        success: true,
        message: 'No expired unpaid orders to clean up.',
      });
    }

    // Cleanup duplicate orders for the same user ID in both Order and StudentCourses
    const userIdsToCleanup = deletedOrders.deletedCount > 0
      ? deletedOrders.deletedDocuments.map(order => order.userId)
      : [];

    // Remove duplicates in Orders
    await Order.deleteMany({
      userId: { $in: userIdsToCleanup },
      _id: { $ne: deletedOrders._id }, // Use the correct _id reference
    });

    // Aggregation to remove duplicate userIds in StudentCourses
    await StudentCourses.aggregate([
      {
        $group: {
          _id: "$userId",
          uniqueCourses: { $push: "$$ROOT" }
        }
      },
      {
        $unwind: "$uniqueCourses"
      },
      {
        $replaceRoot: { newRoot: "$uniqueCourses" }
      },
      {
        $out: "studentcourses" // Update the existing collection
      }
    ]);

    res.status(200).json({
      success: true,
      message: `Server is running smoothly! Deleted ${deletedOrders.deletedCount} expired unpaid orders.`,
    });
  } catch (error) {
    console.error('Error in / endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// auth routes
app.use('/auth', authRoutes);
// media routes
app.use('/media', mediaRoutes);
// instructorDashBoards routes
app.use('/instructor/course', instructorCourseRoutes);
// Student routes
app.use('/student/course', studentViewCourseRoutes);
app.use('/student/courses-owned', studentCoursesRoutes);
app.use('/student/course-progress', studentProgressRoutes);
// paypal routes
app.use('/student/order', studentViewOrderRoutes);