import axios from 'axios';

export const getUserMessages = id => {
    return axios
      .get(`http://localhost:8080/messages/getAll/${id}`)
      .then((response) => {
        return response.data.messages;
      });
};

export const sendMessage = (sender, receiver, content) => {
    return axios.post('http://localhost:8080/messages/send', { sender, receiver, content })
    .then(response => {
      return response.data.message;
    });
}

export const deleteMessage = messageId => {
    return axios
      .post('http://localhost:8080/messages/delete', messageId)
      .then((response) => {
        return response.data.message;
      });
};

export const updateMessage = (messageId, message) => {
  return axios
    .put('http://localhost:8080/messages/update', { messageId, message })
    .then((response) => {
      return response.data.message;
    });
};


  
