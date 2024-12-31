import CommonForm from '@/components/common-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInFormControls, signUpFormControls } from '@/config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useContext, useState } from 'react';
import { AuthContext } from '@/context/auth-context';

const AuthPage = () => {

    const [activeTab, setActiveTab] = useState('signin');
    const { 
        signInFormData, 
        setSignInFormData, 
        signUpFormData, 
        setSignUpFormData, 
        handleRegisterUser,
        handleLoginUser, 
    } = useContext(AuthContext);

    function validateSignInFormIsValid() {
        return (
            signInFormData &&
            signInFormData.userEmail !== "" &&
            signInFormData.password !== ""
        );
    }

    function validateSignUpFormIsValid() {
        return (
            signUpFormData &&
            signUpFormData.userName !== "" &&
            signUpFormData.userEmail !== "" &&
            signUpFormData.password !== "" &&
            signUpFormData.confirmPassword !== ""
        );
    }

    return (
        <div className="flex flex-col">
            <div className="flex my-4 justify-center bg-background">
                <Tabs
                    value={activeTab}
                    defaultValue="signin"
                    onValueChange={e => setActiveTab(e)}
                    className="w-full max-w-sm"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Sign in to your account</CardTitle>
                                <CardDescription>Enter your email and password to access your account</CardDescription>
                                <CardContent className="space-y-2">
                                    <CommonForm
                                        formControls={signInFormControls}
                                        buttonText={'Sign In'}
                                        formData={signInFormData}
                                        setFormData={setSignInFormData}
                                        isButtonDisabled={!validateSignInFormIsValid()}
                                        handleSubmit={handleLoginUser}
                                    />
                                </CardContent>
                            </CardHeader>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Card className="p-6 space-y-4">
                            <CardHeader className='py-0'>
                                <CardTitle>Create a new account</CardTitle>
                                <CardDescription>
                                    Enter your details to get started
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CommonForm
                                    formControls={signUpFormControls}
                                    buttonText={'Sign Up'}
                                    formData={signUpFormData}
                                    setFormData={setSignUpFormData}
                                    isButtonDisabled={!validateSignUpFormIsValid()}
                                    handleSubmit={handleRegisterUser}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
}

export default AuthPage;
