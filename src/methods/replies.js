import axios from 'axios';

export const getMessageReplies = id => {
    return axios
      .get(`http://localhost:8080/replies/getReplies/${id}`)
      .then((response) => {
        return response.data.replies;
      });
};

export const sendReply = (messageId, sender, content) => {
    return axios.post('http://localhost:8080/replies/send', { messageId, sender, content })
    .then(response => {
      return response.data.message;
    });
}



  
