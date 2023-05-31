import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../../UserContext";
import '../styles/comment.css'

const Comment = (props) => {
    const {userLogin, MAIN_URL} = useContext(UserContext);
    const [like, setLike] = useState(0);
    const [isLike, setIsLike] = useState(false);
    const [isDislike, setIsDislike] = useState(false);
    const [dislike, setDislike] = useState(0);
    const [commentText, setCommentText]=useState('')
    const [IsNewCommentText,setIsNewCommentText]=useState(false)

    useEffect(() => {
        setCommentText(props.comment.text)
        setLike(props.comment.likes ? props.comment.likes.length : 0);
        setDislike(props.comment.dislikes ? props.comment.dislikes.length : 0);
        setIsLike(props.comment.likes ? props.comment.likes.includes(userLogin) : false);
        setIsDislike(props.comment.dislikes ? props.comment.dislikes.includes(userLogin) : false);
    }, [props.comment.likes, props.comment.dislikes, props.comment.text]);
    const handleDeleteComment = () => {
        if (props.comment.username === userLogin || userLogin === "admin") {
            props.delete(props.comment.id)
        }
    };
    const handleEditComment = () => {
        if (props.comment.username === userLogin || userLogin === "admin") {
            setIsNewCommentText(true);
        }
    };
    function handleDislikeButton() {
        if (!isLike && !isDislike) {
            setDislike(dislike + 1);
            setIsDislike(true);
            props.updateComment(props.comment.id, {dislikes: [...props.comment.dislikes, userLogin]});
        } else if (!isLike && isDislike) {
            setDislike(dislike - 1);
            setIsDislike(false);
            props.updateComment(props.comment.id, {dislikes: props.comment.dislikes.filter(user => user !== userLogin)});
        } else if (isLike && !isDislike) {
            setLike(like - 1);
            setDislike(dislike + 1);
            setIsLike(false);
            setIsDislike(true);
            props.updateComment(props.comment.id, {
                likes: props.comment.likes.filter(user => user !== userLogin),
                dislikes: [...props.comment.dislikes, userLogin]
            });
        }

    };
    function handleLikeButton() {
        if (!isLike && !isDislike) {
            setLike(like + 1);
            setIsLike(true);
            props.updateComment(props.comment.id, {likes: [...props.comment.likes, userLogin]});
        } else if (isLike && !isDislike) {
            setLike(like - 1);
            setIsLike(false);
            props.updateComment(props.comment.id, {likes: props.comment.likes.filter(user => user !== userLogin)});
        } else if (!isLike && isDislike) {
            setLike(like + 1);
            setDislike(dislike - 1);
            setIsLike(true);
            setIsDislike(false);
            props.updateComment(props.comment.id, {
                likes: [...props.comment.likes, userLogin],
                dislikes: props.comment.dislikes.filter(user => user !== userLogin)
            });
        }

    };
    function handleCancelChangeComment(){
        setIsNewCommentText(false);
        setCommentText(props.comment.text);
    };
    function handleChangeComment() {
        props.updateComment(props.comment.id, { text: commentText });
        setIsNewCommentText(false);
    }
    return (
        <div className={'comment'}>
            <div className={'headButtonsSection'}>
                <button onClick={handleEditComment}>Edit</button>
                <button onClick={handleDeleteComment}>Delete</button>
            </div>
            {
                IsNewCommentText ?(
                    <div>
                        <input
                            type="text"
                            placeholder="Comment..,"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button onClick={handleCancelChangeComment}>cancel</button>
                        <button onClick={handleChangeComment}>Ok</button>
                    </div>
                ):(
                    <p>{commentText}</p>
                )
            }
            <p>votes {like-dislike}</p>
            <p>date {props.formatDate(props.comment.date)}</p>
            <div>
                <button onClick={handleLikeButton}>like</button>
                <button onClick={handleDislikeButton}>dislike</button>
            </div>
        </div>
    );
};

export default Comment;