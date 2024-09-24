export const StartBtn = ({socket, roomId}: {socket: any, roomId: string}) => {
    return (
        <div>
            Quiz controls(better):
            <button onClick={() => {
            socket.emit("startQuiz", {
                roomId
            })
        }}>Start Quiz</button>
        </div>
    )
}