import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Paper, Typography, List, ListItem, ListItemText, Fade, Slide, Alert, keyframes } from '@mui/material';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL);

function App() {
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('room_joined', ({ success }) => {
      if (success) {
        setIsJoined(true);
        setError('');
      } else {
        setError('Room not found. Please check the Room ID.');
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('room_joined');
    };
  }, []);

  const joinRoom = () => {
    if (room.trim() && username.trim()) {
      socket.emit('join_room', { room, username });
    }
  };

  const endRoom = () => {
    socket.emit('leave_room', { room, username });
    setIsJoined(false);
    setMessages([]);
    setRoom('');
    setUsername('');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        room,
        message,
        time: new Date().toLocaleTimeString(),
        author: username
      };
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };



  if (!isJoined) {
    return (
      <Container maxWidth="sm">
        <Fade in={true} timeout={1000}>
          <Box sx={{
            mt: 8,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(at 0% 0%, #FF6B6B 0%, transparent 50%), radial-gradient(at 100% 0%, #4ECDC4 0%, transparent 50%), radial-gradient(at 0% 100%, #FFD93D 0%, transparent 50%), radial-gradient(at 100% 100%, #6C63FF 0%, transparent 50%)',
              opacity: 0.15,
              animation: 'meshGradient 20s ease infinite',
              zIndex: -1,
              backgroundSize: '200% 200%',
              '@keyframes meshGradient': {
                '0%': { backgroundPosition: '0% 0%' },
                '25%': { backgroundPosition: '100% 0%' },
                '50%': { backgroundPosition: '100% 100%' },
                '75%': { backgroundPosition: '0% 100%' },
                '100%': { backgroundPosition: '0% 0%' }
              }
            }
          }}>
            <Paper elevation={3} sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                LIVELINK 🔗
              </Typography>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Room ID"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                margin="normal"
                sx={{ mb: 3 }}
              />
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                variant="contained"
                onClick={joinRoom}
                size="large"
                sx={{
                  minWidth: 200,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Join Room 🚀
              </Button>
            </Paper>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Box sx={{
          mt: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(at 0% 0%, #ee7752 0%, transparent 50%), radial-gradient(at 100% 0%, #e73c7e 0%, transparent 50%), radial-gradient(at 0% 100%, #23a6d5 0%, transparent 50%), radial-gradient(at 100% 100%, #23d5ab 0%, transparent 50%)',
            backgroundSize: '200% 200%',
            opacity: 0.2,
            animation: 'meshGradient 20s ease infinite',
            zIndex: -1,
            '@keyframes meshGradient': {
              '0%': { backgroundPosition: '0% 0%' },
              '25%': { backgroundPosition: '100% 0%' },
              '50%': { backgroundPosition: '100% 100%' },
              '75%': { backgroundPosition: '0% 100%' },
              '100%': { backgroundPosition: '0% 0%' }
            }
          },
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <Paper elevation={3} sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}>
            <Typography variant="h4" gutterBottom>
              Room: {room} 💬
              <Button
                variant="outlined"
                color="error"
                onClick={endRoom}
                sx={{
                  ml: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                End Chat 👋
              </Button>
            </Typography>
            <List sx={{
              position: 'relative',
              height: '400px',
              overflowY: 'auto',
              bgcolor: '#f5f5f5',
              mb: 2,
              borderRadius: 2,
              p: 2,
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
                '&:hover': {
                  background: '#555'
                }
              }
            }}>
              {messages.map((msg, index) => (
                <Fade in={true} timeout={500} key={index}>
                  <ListItem sx={{
                    bgcolor: msg.author === username ? 'rgba(227, 242, 253, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    mb: 1,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}>
                    <ListItemText
                      primary={msg.message}
                      primaryTypographyProps={{
                        style: { wordBreak: 'break-word' }
                      }}
                      secondary={`${msg.author === 'System' ? '🤖' : '👤'} ${msg.author} - ${msg.time}`}
                    />
                  </ListItem>
                </Fade>
              ))}
            </List>

            <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Send ✉️
              </Button>
            </Box>
          </Paper>
        </Box>
      </Slide>
    </Container>
  );
}

export default App;