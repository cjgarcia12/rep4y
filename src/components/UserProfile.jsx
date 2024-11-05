import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import "./userprofile.css";

function UserProfile() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        email: user?.email || "",
        username: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        streetAddress: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("user_id", user?.id)
                .single();

            if (error) setError("Failed to load profile data.");
            else {
                setFormData({
                    email: user.email,
                    username: profile.username || "",
                    firstName: profile.firstname || "",
                    lastName: profile.lastname || "",
                    phoneNumber: profile.phonenumber || "",
                    streetAddress: profile.streetaddress || "",
                    city: profile.city || "",
                    state: profile.state || "",
                    country: profile.country || "",
                    zipCode: profile.zipcode || "",
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user?.id, user?.email]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from("profiles")
                .update({
                    username: formData.username,
                    firstname: formData.firstName,
                    lastname: formData.lastName,
                    phonenumber: formData.phoneNumber,
                    streetaddress: formData.streetAddress,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    zipcode: formData.zipCode,
                })
                .eq("user_id", user?.id)
                .select();

            if (error) setError("Failed to update profile.");
            else console.log("Profile updated successfully:", data);
            alert("Profile updated successfully!");

        } catch (error) {
            setError("An error occurred while updating.");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <Card className="profile-card">
                <CardHeader>
                    <CardTitle>Howdy! {formData.username || "Your Account"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="columns">
                            {/* Left Column */}
                            <div className="column-1">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" className="input-field"
                                           value={formData.email} disabled/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" id="username" name="username" className="input-field"
                                           value={formData.username} onChange={handleInputChange} required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" id="firstName" name="firstName" className="input-field"
                                           value={formData.firstName} onChange={handleInputChange} required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" className="input-field"
                                           value={formData.lastName} onChange={handleInputChange} required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" className="input-field"
                                           value={formData.phoneNumber} onChange={handleInputChange} required/>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="column-2">
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <select id="country" name="country" className="input-field" value={formData.country}
                                            onChange={handleInputChange} required>
                                        <option value="">Select Country</option>
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {formData.country === "United States" || formData.country === "Canada" ? (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="state">State/Province</label>
                                            <input type="text" id="state" name="state" className="input-field"
                                                   value={formData.state} onChange={handleInputChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="zipCode">Zip Code</label>
                                            <input type="text" id="zipCode" name="zipCode" className="input-field"
                                                   value={formData.zipCode} onChange={handleInputChange} required/>
                                        </div>
                                    </>
                                ) : null}
                                <div className="form-group">
                                    <label htmlFor="streetAddress">Street Address</label>
                                    <input type="text" id="streetAddress" name="streetAddress" className="input-field"
                                           value={formData.streetAddress} onChange={handleInputChange} required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input type="text" id="city" name="city" className="input-field"
                                           value={formData.city} onChange={handleInputChange} required/>
                                </div>
                            </div>
                        </div>

                        {/* Submit and Cancel Buttons */}

                        <CardFooter className="card-foot-up">

                            <button className="cancel-button-up" type="button" onClick={handleCancel}>
                                Cancel
                            </button>

                            <button className="save-button-up" type="submit">
                                Save
                            </button>

                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default UserProfile;
