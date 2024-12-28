import fetchApi from "../utils/fetchApi";

export const signupApi = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    return fetchApi('/auth/signup', 'POST', data)
}