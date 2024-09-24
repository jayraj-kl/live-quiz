import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client/debug";
import { CreateProblem } from "./CreateProblem";
import { QuizControls } from "./QuizControls";
import { StartBtn } from "./StartBtn";
import { LeaderBoard } from "./leaderboard/LeaderBoard";

export const Admin = () => {
    const [socket, setSocket] = useState<null | any>(null);
    const [quizId, setQuizId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const socket = io("http://localhost:3000/");
        setSocket(socket)

        socket.on("connect", () => {
            console.log(socket.id);
            socket.emit("joinAdmin", {
                password: "ADMIN_PASSWORD"
            })
        });

        socket.on("leaderboard", (data) => {
            setLeaderboard(data.leaderboard);
        });
        
    }, []);

    if (!quizId) {
        return <div>    
        <input type="text" onChange={(e) => {
            setRoomId(e.target.value)
        }} />
        <br />
        <button onClick={() => {
            socket.emit("createQuiz", {
                roomId
            });
            setQuizId(roomId);
        }}>Create room</button>
    </div>
    }
    return <div> 
        <CreateProblem roomId={quizId} socket={socket} />
        <QuizControls socket={socket} roomId={roomId} />
        <StartBtn socket={socket} roomId={roomId} />
        <LeaderBoard leaderboardData={leaderboard.map((x: any) => ({
            points: x.points,
            username: x.name,
            image: x.image
        }))} />
    </div>
}