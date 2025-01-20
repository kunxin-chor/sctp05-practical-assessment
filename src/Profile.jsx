import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useJwt } from "./UserStore";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useFlashMessage } from './FlashMessageStore';
import * as Yup from 'yup';

export default function Profile() {
    const { getJwt } = useJwt();
    const [initialValues, setInitialValues] = useState({});
    const { showMessage } = useFlashMessage();


    useEffect(() => {
        async function fetchData() {
            const token = getJwt();
            const response = await axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setInitialValues(response.data.user);
        }
        fetchData();

    }, []);

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        salutation: Yup.string(),
        marketingPreferences: Yup.array().of(Yup.string()),
        country: Yup.string(),
    });

    const handleSubmit = async (values, actions) => {
        try {
            const token = getJwt();
            if (!token) {
                showMessage('You must be logged in to update your profile.', 'error');
                actions.setSubmitting(false);
                return;
            }

            await axios.put(import.meta.env.VITE_API_URL + '/api/users/me', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            showMessage('Profile updated successfully!', 'success');
            actions.setSubmitting(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            actions.setErrors({ submit: error.response?.data?.message || 'An error occurred' });
            actions.setSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Edit Profile</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize // Allows form to reinitialize with fetched profile data
            >
                {function (formik) {
                    return (
                        <Form>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <Field type="text" id="name" name="name" className="form-control" />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field type="email" id="email" name="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="salutation" className="form-label">Salutation</label>
                                <Field as="select" id="salutation" name="salutation" className="form-control">
                                    <option value="">Select</option>
                                    <option value="Mr">Mr.</option>
                                    <option value="Ms">Ms.</option>
                                    <option value="Mrs">Mrs.</option>
                                    <option value="Dr">Dr.</option>
                                </Field>
                                <ErrorMessage name="salutation" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="marketingPreferences" className="form-label">Marketing Preferences</label>
                                <Field as="select" id="marketingPreferences" name="marketingPreferences" multiple className="form-control">
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                </Field>
                                <ErrorMessage name="marketingPreferences" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="country" className="form-label">Country</label>
                                <Field as="select" className="form-select" id="country" name="country">
                                    <option value="">Select Country</option>
                                    <option value="sg">Singapore</option>
                                    <option value="my">Malaysia</option>
                                    <option value="in">Indonesia</option>
                                    <option value="th">Thailand</option>
                                </Field>
                                <ErrorMessage name="country" component="div" className="text-danger" />
                            </div>

                            {formik.errors.submit && <div className="alert alert-danger">{formik.errors.submit}</div>}

                            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? 'Updating...' : 'Update Profile'}
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    )
}