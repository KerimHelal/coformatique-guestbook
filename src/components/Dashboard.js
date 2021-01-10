import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import Alert from 'react-s-alert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import { logout, getCurrentUser } from '../methods/auth';
import { getAllUsers } from '../methods/users';
import { getUserMessages, deleteMessage, updateMessage, sendMessage } from '../methods/messages';
import { getMessageReplies, sendReply } from '../methods/replies';

const useStyles = theme => ({
    paper: {
      marginTop: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    form: {
      width: '100%',
      marginTop: 10
    },
    formControl: {
        margin: 17,
        minWidth: 120
    },
    messageInput: {
        width: '70%'
    },
    submit: {
      marginTop: 25
    }
  });

class Dashbaord extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            modalOpened: false,
            currentMessage: {},
            message: {},
            messagesList: [],
            user: {},
            replyContent: '',
            replyOpen: false,
            messageReplies: []
        }
    }

    componentDidMount(){
        const user = getCurrentUser();
        this.setState({ user });
        if(!user){
            this.props.history.push('/');
        }
        getAllUsers(user.id).then(response => {
            response = response.filter(obj  => {
                return obj._id !== user.id;
            });
            this.setState({ users: response });
        });
        getUserMessages(user.id).then(response => {
            this.setState({ messagesList: response }, () => {
                response.forEach(element => {
                    getMessageReplies(element._id).then(response => {
                        this.setState({ messageReplies: [...this.state.messageReplies, ...response], });
                    });
                });
            });
        });
    }
    
    handleChange = (e) => {
        if(e.target.name === "replyContent") {
            this.setState({ replyContent: e.target.value });
        } else {
            this.setState({ message: {...this.state.message, [e.target.name]: e.target.value}});
        }
    }

    onSubmit = e => { 
        e.preventDefault();
        if(this.state.message.messageContent !== '') {
            const sender = {
                id: this.state.user.id,
                name: this.state.user.name
            };
            const receiver = {
                id: this.state.message.receiverId,
                name: this.state.users.filter(x => x._id === this.state.message.receiverId)[0].name
            };
            sendMessage(sender, receiver, this.state.message.content)
            .then(response => {
                Alert.success(response);
                this.setState({ message: { receiverId: '', messageContent: '' }});

                getUserMessages(this.state.user.id).then(response => {
                    this.setState({ messagesList: response });
                });
            },
            (error) => {
                const errorMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              Alert.error(errorMessage);
            });
        } else {
            Alert.error("Please fill all of the fields");
        }
    }

    deleteEntry = id => {
        deleteMessage(id).then((response) => {
            this.setState({ messagesList : this.state.messagesList.filter(item => item._id !== id) });
            Alert.success(response);
            
        });
    }

    openUpdateModal = currentMessage => {
        this.setState({ modalOpened: true, currentMessage });
    }

    updateEntry = () => {
        updateMessage(this.state.currentMessage._id, this.state.currentMessage.content).then(response => {
            Alert.success(response);
            this.setState({ modalOpened: false });
        });
    }

    getReplies = id => {
        const replies = [...this.state.messageReplies];
        const messageReplies = replies.filter(element => element.messageId === id);
        return messageReplies;
    }

    renderReplies = id => {
        if(this.getReplies(id).length > 0) {
            return this.getReplies(id).map((reply, i) => { 
                return (
                    <TableRow key={i}>
                        <TableCell>{(reply.sender || {}).name}</TableCell>
                        <TableCell>{reply.content}</TableCell>
                    </TableRow>
                    )
            })  
        }
        return (
            <TableRow style={{ textAlign: 'center' }}>
                <TableCell>No replies, send one now using the form above!</TableCell>
            </TableRow>
        )
        
    }

    replyToMessage = (e, messageId) => {
        const sender = {
            id: this.state.user.id,
            name: this.state.user.name
        };
        sendReply(messageId, sender, this.state.replyContent)
            .then(response => {
                getMessageReplies(messageId).then(response => {
                    this.setState({ messageReplies: [...this.state.messageReplies, ...response], });
                });
                Alert.success(response);
                this.setState({ replyContent: '' });
            },
            (error) => {
                const errorMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              Alert.error(errorMessage);
            });
    }

    renderMessages = () => {
        const { classes } = this.props;
        if(!this.state.messagesList.length) {
            return (
            <TableRow style={{ textAlign: 'center' }}>
                <TableCell>You don't have any messages, send one using the form above !</TableCell>
            </TableRow>)
        }
        return (this.state.messagesList || []).map((row, i) => {
            return (
                <>
                    <TableRow key={i}>
                        <TableCell>
                            <IconButton aria-label="expand row" size="small" onClick={() => this.setState({ replyOpen: !this.state.replyOpen })}>
                                {this.state.replyOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{row.sender.name}</TableCell>
                        <TableCell>{row.receiver.name}</TableCell>
                        <TableCell>{row.content}</TableCell>
                        <TableCell>
                            <Button variant="outlined" onClick={() => this.deleteEntry(row._id)}>Delete</Button> &nbsp;
                            <Button variant="outlined" onClick={() => this.openUpdateModal(row)}>Update</Button>

                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={this.state.replyOpen} timeout="auto" unmountOnExit>
                                <Box margin={1}>
                                    <TextField
                                        name="replyContent"
                                        type="text"
                                        value={this.state.replyContent}
                                        margin="normal"
                                        onChange={this.handleChange}
                                        label="Message"
                                        className={classes.messageInput}
                                    /> &nbsp;&nbsp; 
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        onClick={e => this.replyToMessage(e, row._id)}
                                    >
                                        Reply
                                    </Button>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Replies
                                    </Typography>
                                    <Table size="small" >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Reply By</TableCell>
                                                <TableCell>Content</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.renderReplies(row._id)}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
              </>

            )
        })
    }

    renderUsers = () => {
        if(!this.state.users.length) {
            return <MenuItem value="" disabled>No users found</MenuItem>
        }
        return (this.state.users.map((user, i) => {
            return <MenuItem key={i} value={user._id}>{user.name}</MenuItem>
        }));
    }
    

    render(){
        const { classes } = this.props;
        return (
            <Container component="main">
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Messages Dashboard
                    </Typography>
                    <form className={classes.form} onSubmit={this.onSubmit}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Send To</InputLabel>
                            <Select
                            value={this.state.message.receiverId}
                            onChange={this.handleChange}
                            name="receiverId"
                            >
                                {this.renderUsers()}
                            </Select>
                        </FormControl>
                        <TextField
                            name="content"
                            type="text"
                            value={this.state.message.messageContent}
                            margin="normal"
                            onChange={this.handleChange}
                            label="Message"
                            className={classes.messageInput}
                        /> &nbsp;&nbsp; 
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            >
                            Send Message
                        </Button>
                    </form>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>#ID</TableCell>
                                    <TableCell>From</TableCell>
                                    <TableCell>To</TableCell>
                                    <TableCell>Content</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.renderMessages()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <Button
                 variant="contained"
                 color="secondary"  
                 className={classes.submit}
                 onClick={() => { logout(); this.props.history.push('/') }}>
                     Logout
                </Button>
                <Dialog maxWidth="sm" fullWidth open={this.state.modalOpened} onClose={() => this.setState({ modalOpened: false })} >
                    <DialogTitle id="form-dialog-title">Update Message</DialogTitle>
                    <DialogContent>
                        <TextField
                            name="content"
                            type="text"
                            value={this.state.currentMessage.content}
                            onChange={e => this.setState({ currentMessage: {...this.state.currentMessage, content: e.target.value}})}
                            margin="normal"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.setState({ modalOpened: false })} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.updateEntry()} color="primary">
                        Update
                    </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        )}
}

export default withStyles(useStyles)(Dashbaord);

