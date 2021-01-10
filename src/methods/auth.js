import axios from 'axios';

export const register = (email, password, name) => {
    return axios.post('http://localhost:8080/auth/register', { email, password, name })
    .then(response => {
      return response.data.message;
    });
}

export const login = (email, password) => {
    return axios
      .post('http://localhost:8080/auth/login', { email, password })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.accessToken };
    } else {
      return {};
    }
  }
  
