import { Card } from '@/components/ui/card';
import './style.css'
import { AuthContext } from '@/context/auth-context';
import { cancelledFinalizePaymentService, captureAndFinalizePaymentService } from '@/services';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaypalPaymentReturnPage = () => {
    const { auth, location, navigate } = useContext(AuthContext);
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    useEffect(() => {
        if (paymentId && payerId) {
            (async () => {
                const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

                // Show a loading toast
                const toastId = toast.loading('Processing payment...');

                try {
                    const response = await captureAndFinalizePaymentService(paymentId, payerId, orderId);

                    if (response.success) {
                        // Update the toast with a success message
                        toast.update(toastId, { render: 'Payment successful!', type: 'success', isLoading: false, autoClose: 3000 });
                        sessionStorage.removeItem('currentOrderId');
                    } else {
                        // Update the toast with an error message
                        toast.update(toastId, { render: 'Payment failed. Please try again.', type: 'error', isLoading: false, autoClose: 3000 });
                    }
                } catch (err) {
                    // Update the toast with an error message
                    toast.update(toastId, { render: 'An error occurred during payment.', type: 'error', isLoading: false, autoClose: 3000 });
                    console.error('payment', err);
                }
                if(auth.user.role==='instructor'){
                    navigate('instructor');
                }else{
                    navigate('student/student-courses');
                }
            })();
        } else if (location.pathname.includes('payment-cancel')) {
            (async () => {
                const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

                // Show a loading toast
                const toastId = toast.loading('Cancelling order...');

                try {
                    const response = await cancelledFinalizePaymentService(orderId);

                    if (response.success) {
                        // Update the toast with a success message
                        toast.update(toastId, { render: 'Order successfully cancelled.', type: 'success', isLoading: false, autoClose: 3000 });
                        alert('Order cancelled'); // Optional: You may remove this if toast is enough
                    } else {
                        // Update the toast with an error message
                        toast.update(toastId, { render: 'Failed to cancel order.', type: 'error', isLoading: false, autoClose: 3000 });
                    }
                } catch (err) {
                    // Update the toast with an error message
                    toast.update(toastId, { render: 'An error occurred while cancelling the order.', type: 'error', isLoading: false, autoClose: 3000 });
                    alert('Something went wrong while cancelling the order'); // Optional: You may remove this if toast is enough
                    console.error(err);
                }
                if(auth.user.role==='instructor'){
                    navigate('instructor'); 
                }else{
                    navigate('student/student-courses');
                }
            })();
        }
    }, [payerId, paymentId]);

    return (
        <Card className='h-[100vh] flex justify-center items-center'>
            <div className="payment-loader">
                <div className="pad">
                    <div className="chip"></div>
                    <div className="line line1"></div>
                    <div className="line line2"></div>
                </div>
                <div className="loader-text">
                    Please wait while payment is loading
                </div>
            </div>
        </Card>
    );
};

export default PaypalPaymentReturnPage;
