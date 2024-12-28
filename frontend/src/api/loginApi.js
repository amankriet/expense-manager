export const loginApi = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    return fetchApi('/auth/login', 'POST', data)
}