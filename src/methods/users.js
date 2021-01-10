import axios from 'axios';

export const getAllUsers = () => {
    return axios
      .get('http://localhost:8080/users/getAll')
      .then((response) => {
        return response.data.users;
      });
};




  
