import { Typography, Box, Stack, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import ChatHistoryCard from '../../components/ChatHistoryCard/ChatHistoryCard';
import ChatFilter from '../../components/ChatFilter/ChatFilter';
import Navbar from '../../components/Navbar/Navbar';

export default function History() {
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);

    useEffect(() => {
        const localChats = JSON.parse(localStorage.getItem('chat') || '[]');
        setChats(localChats);
        setFilteredChats(localChats);
    }, []);

    return (
        <Box
            height="100vh"
            overflow="hidden"
            sx={{
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: '10px' },
                '&::-webkit-scrollbar-track': {
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(151, 133, 186, 0.4)',
                    borderRadius: '8px',
                },
            }}
        >
            <Navbar />

            <Box p={{ xs: 2, md: 3 }}>
                <Typography variant="h2" textAlign="center" mb={3}>
                    Conversation History
                </Typography>

                {chats.length > 0 ? (
                    <>
                        <ChatFilter allChats={chats} filterChats={setFilteredChats} />

                        {filteredChats.length > 0 ? (
                            <Stack
                                spacing={4}
                                divider={<Divider sx={{ borderColor: 'primary.bg', opacity: 0.4 }} />}
                            >
                                {filteredChats.map((item) => (
                                    <ChatHistoryCard details={item} key={item.id} />
                                ))}
                            </Stack>
                        ) : (
                            <Typography
                                textAlign="center"
                                p={3}
                                bgcolor="primary.light"
                                borderRadius={2}
                            >
                                No such chats.
                            </Typography>
                        )}
                    </>
                ) : (
                    <Typography
                        textAlign="center"
                        p={3}
                        bgcolor="primary.light"
                        borderRadius={2}
                    >
                        No saved chats.
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
