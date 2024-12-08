import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState, useContext } from 'react';
import { useOutletContext } from "react-router-dom";
import InitialChat from '../../components/InitialChat/InitialChat';
import ChatInput from '../../components/ChatInput/ChatInput';
import ChattingCard from '../../components/ChattingCard/ChattingCard';
import FeedbackModal from '../../components/FeedbackModal/FeedbackModal';
import Navbar from '../../components/Navbar/Navbar';
import { ThemeContext } from '../../theme/ThemeContext';
import data from '../../aiData/sampleData.json';

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const listRef = useRef(null);
    const [chatId, setChatId] = useState(1);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [scrollToBottom, setScrollToBottom] = useState(false);

    const { chat = [], setChat = () => {} } = useOutletContext(); // Default values for safety
    const { mode = 'light' } = useContext(ThemeContext); // Default mode

    // GENERATING AI RESPONSE
    const generateResponse = (input) => {
        const response = data.find(
            (item) => input.localeCompare(item.question, undefined, { sensitivity: 'base' }) === 0
        );

        const answer = response?.response || "Sorry, did not understand your query!";

        setChat((prev) => [
            ...prev,
            {
                type: 'Human',
                text: input,
                time: new Date(),
                id: chatId,
            },
            {
                type: 'AI',
                text: answer,
                time: new Date(),
                id: chatId + 1,
            },
        ]);

        setChatId((prev) => prev + 2);
    };

    // AUTOSCROLL TO LAST ELEMENT
    useEffect(() => {
        const lastChild = listRef.current?.lastElementChild;
        if (lastChild) {
            lastChild.scrollIntoView({ behavior: 'smooth' });
        }
    }, [scrollToBottom]);

    // Reusable scrollbar styles
    const scrollbarStyles = {
        '&::-webkit-scrollbar': { width: '10px' },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(151, 133, 186, 0.4)',
            borderRadius: '8px',
        },
    };

    return (
        <Stack
            height="100vh"
            justifyContent="space-between"
            sx={{
                '@media (max-width:767px)': {
                    background: mode === 'light' ? 'linear-gradient(#F9FAFA 60%, #EDE4FF)' : '',
                },
            }}
        >
            <Navbar />

            {chat.length === 0 ? (
                <InitialChat generateResponse={generateResponse} />
            ) : (
                <Stack
                    height={1}
                    flexGrow={0}
                    p={{ xs: 2, md: 3 }}
                    spacing={{ xs: 2, md: 3 }}
                    sx={{ overflowY: 'auto', ...scrollbarStyles }}
                    ref={listRef}
                >
                    {chat.map((item) => (
                        <ChattingCard
                            details={item}
                            key={item.id}
                            updateChat={setChat}
                            setSelectedChatId={setSelectedChatId}
                            showFeedbackModal={() => setShowModal(true)}
                        />
                    ))}
                </Stack>
            )}

            <ChatInput
                generateResponse={generateResponse}
                setScroll={setScrollToBottom}
                chat={chat}
                clearChat={() => setChat([])}
            />

            <FeedbackModal
                open={showModal}
                updateChat={setChat}
                chatId={selectedChatId}
                handleClose={() => setShowModal(false)}
            />
        </Stack>
    );
}
