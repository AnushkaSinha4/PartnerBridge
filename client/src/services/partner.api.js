import api from "./api";


// Submit onboarding form
export const submitPartnerForm = async(data) => {
    const res = await api.post("/partners/onboarding", data);
    return res.data;
};


// Get logged partner status
export const getPartnerStatus = async() => {
    const res = await api.get("/partners/me");
    return res.data;
};


// Admin: get all partners
export const getAllPartners = async() => {
    const res = await api.get("/partners/admin/partners");
    return res.data;
};


// Admin: update partner status
export const updatePartnerStatus = async(id, status) => {
    const res = await api.put(`/partners/admin/partners/${id}/status`, {
        status
    });

    return res.data;
};