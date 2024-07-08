"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,  // Set continuous to true
        useLegacyResults: false
    });

    useEffect(() => {
        if (results) {
            results.forEach(result => {
                setUserAnswer(prevAns => prevAns + result.transcript);
            });
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAnswer();
        }
    }, [isRecording, userAnswer]);

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            try {
                await startSpeechToText();
            } catch (e) {
                console.error(e);
                toast.error("An error occurred while starting speech recognition.");
            }
        }
    };

    const UpdateUserAnswer = async () => {
        console.log(userAnswer);
        setLoading(true);
        const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question +
            ", User Answer:" + userAnswer + ",Depends on question and user answer for give interview question " +
            " please give us rating for answer and feedback as area of improvement if any " +
            "in just 5 to 8 lines to improve it in JSON format with rating field and feedback field";

        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
        const JsonFeedbackResp = JSON.parse(mockJsonResp);
        const resp = await db.insert(UserAnswer)
            .values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback,
                rating: JsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy')
            });

        if (resp) {
            toast.success('User Answer recorded successfully');
            setUserAnswer('');
            setResults([]);
        }

        setLoading(false);
    };

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                <Image src={'/webcam.png'} width={250} height={300} className='absolute' />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 350,
                        width: 500,
                        zIndex: 10,
                    }}
                />
            </div>
            <Button
                disabled={loading}
                variant="outline"
                className="my-10"
                onClick={StartStopRecording}
            >
                {isRecording ?
                    <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                        <StopCircle />Stop Recording
                    </h2>
                    :
                    <h2 className='text-primary flex gap-2 items-center'>
                        <Mic />Record Answer
                    </h2>
                }
            </Button>
        </div>
    );
}

export default RecordAnswerSection;
