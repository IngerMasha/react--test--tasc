import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../../UserContext";
import Comment from "./Comment";
import '../styles/post.css'

const Post = (props) => {
    const {userLogin, MAIN_URL} = useContext(UserContext);
    const [like, setLike] = useState(0);
    const [isLike, setIsLike] = useState(false);
    const [isDislike, setIsDislike] = useState(false);
    const [dislike, setDislike] = useState(0);
    const [newPostTitle, setNewPostTitle] = useState(false);
    const [title, setTitle] = useState(props.post.title);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([])
    const [isComment, setIsComment] = useState(false);
    const [isAllComment, setIsAllComment] = useState(false);
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        setLike(props.post.likes ? props.post.likes.length : 0);
        setDislike(props.post.dislikes ? props.post.dislikes.length : 0);
        setIsLike(props.post.likes ? props.post.likes.includes(userLogin) : false);
        setIsDislike(props.post.dislikes ? props.post.dislikes.includes(userLogin) : false);
        setComments(props.post.comments ? props.post.comments : [])
        setTitle(props.post.title);
        setImageSrc(props.post.imageSrc ? props.post.imageSrc : '')
    }, [props.post.likes, props.post.dislikes, props.post.title, props.post.comments, props.post.imageSrc]);
    const handleLikeButton = () => {
        if (!isLike && !isDislike) {
            setLike(like + 1);
            setIsLike(true);
            props.updatePost(props.post.id, {likes: [...props.post.likes, userLogin]});
        } else if (isLike && !isDislike) {
            setLike(like - 1);
            setIsLike(false);
            props.updatePost(props.post.id, {likes: props.post.likes.filter(user => user !== userLogin)});
        } else if (!isLike && isDislike) {
            setLike(like + 1);
            setDislike(dislike - 1);
            setIsLike(true);
            setIsDislike(false);
            props.updatePost(props.post.id, {
                likes: [...props.post.likes, userLogin],
                dislikes: props.post.dislikes.filter(user => user !== userLogin)
            });
        }
    };
    const handleDislikeButton = () => {
        if (!isLike && !isDislike) {
            setDislike(dislike + 1);
            setIsDislike(true);
            props.updatePost(props.post.id, {dislikes: [...props.post.dislikes, userLogin]});
        } else if (!isLike && isDislike) {
            setDislike(dislike - 1);
            setIsDislike(false);
            props.updatePost(props.post.id, {dislikes: props.post.dislikes.filter(user => user !== userLogin)});
        } else if (isLike && !isDislike) {
            setLike(like - 1);
            setDislike(dislike + 1);
            setIsLike(false);
            setIsDislike(true);
            props.updatePost(props.post.id, {
                likes: props.post.likes.filter(user => user !== userLogin),
                dislikes: [...props.post.dislikes, userLogin]
            });
        }
    };
    const handleDeletePost = (id) => {
        if (props.post.username === userLogin || userLogin === "admin") {
            props.delete(id)
        }
    };
    const handleEditButton = () => {
        if (props.post.username === userLogin || userLogin === "admin") {
            setNewPostTitle(true);
        }
    };
    const handleCancelNewPostTitle = () => {
        setNewPostTitle(false);
        setTitle(props.post.title);
    };
    const handleCreateNewPostTitle = () => {
        props.updatePost(props.post.id, {title});
        setNewPostTitle(false);
    };
    const handleAddCommentButton = () => {
        setIsComment(true);
    };
    const handleCancelNewComment = () => {
        setIsComment(false);
        setComment('');
    };
    const handleCreateNewComment = () => {
        const newComment = {
            text: comment,
            postId: props.post.id,
            username: props.post.username,
        };
        fetch(`${MAIN_URL}comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
        })
            .then(response => response.json())
            .then(data => {
                const updatedComments = [...comments, data];
                props.updatePost(props.post.id, {comments: updatedComments});

            })
            .catch(error => {
                console.error('Ошибка при создании комментария:', error);
            });

        setIsComment(false);
        setComment('');
    };
    const updateComment = (commentId, updatedData) => {
        fetch(`${MAIN_URL}comment/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(updatedComment => {
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === updatedComment.id
                            ? {
                                ...comment,
                                likes: updatedComment.likes,
                                dislikes: updatedComment.dislikes,
                                text: updatedComment.text,
                            }
                            : comment
                    )
                );
            })
            .catch(error => {
                console.error(error);
            });

    };
    const deleteComment = (commentId) => {
        fetch(`${MAIN_URL}comment/${commentId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(deletedComment => {
                setComments(prevComments => prevComments.filter(comment => comment.id !== deletedComment.id));
            })
            .catch(error => {
                console.error(error);
            });
    }
    const handleAllComments = () => {
        setIsAllComment(!isAllComment);
    };
    const formatDate = (dateString) => {
        const date = new Date(Number(dateString));
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}.${month}.${year}`;
    };
    const handleFileChange = (e) => {
        if (props.post.username === userLogin || userLogin === "admin") {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
        }
    };
    const pictureUpload = (postId, file) => {
        if (file) {
            const formData = new FormData();
            formData.append('picture', file);

            fetch(`${MAIN_URL}post/${postId}/picture`, {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then((data) => {
                    setImageSrc(data.result.imageSrc);
                    props.updatePost(postId, {imageSrc: data.result.imageSrc});


                })
                .catch((error) => {
                    console.error('Image upload error:', error);
                });

        }
    };

    function handleUpload() {
        if (props.post.username === userLogin || userLogin === "admin") {
            pictureUpload(props.post.id, file)
        }

    }

    return (
        <div className={'post'}>
            <div className={'postInf'}>
                <div className={'idSection'}>
                    <p>{props.post.id}</p>
                    <p>{props.post.username}</p>
                </div>
                <div className={'headButtonsSection'}>
                    <button onClick={handleEditButton}>Edit</button>
                    <button onClick={() => handleDeletePost(props.post.id)}>Del</button>
                </div>
            </div>
            <div className={'title'}>
                {newPostTitle ? (
                    <div>
                        <input
                            type="text"
                            placeholder="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <button onClick={handleCancelNewPostTitle}>cancel</button>
                        <button onClick={handleCreateNewPostTitle}>Ok</button>
                    </div>
                ) : (
                    <p>{title}</p>
                )}
            </div>
            <div className={'pictureSection'}>
                {
                    imageSrc ? (
                            <div className={'picture'}>
                                <img src={imageSrc} alt="Uploaded"/>
                            </div>)
                        :
                        (<p>No image</p>)
                }
                <div className={'uploadSection'}>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Uploud</button>
                </div>


            </div>
            <div className={'likeSection'}>
                <p>votes number: {like - dislike}</p>
                <p>date: {formatDate(props.post.date)}</p>
                <div className={'likeButtonsSection'}>
                    <button onClick={handleLikeButton}>like {like}</button>
                    <button onClick={handleDislikeButton}>dislike {dislike}</button>

                </div>
            </div>

            <div className={'commentsSection'}>
                <button onClick={handleAddCommentButton}>Add comment</button>
                {
                    isComment && (

                        <div>
                            <input
                                type="text"
                                placeholder="Comment..,"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button onClick={handleCancelNewComment}>cancel</button>
                            <button onClick={handleCreateNewComment}>Ok</button>
                        </div>

                    )
                }
                <button onClick={handleAllComments}>All comments</button>
                {
                    isAllComment && (

                        comments.map((item, index) => {
                            return <Comment key={index} formatDate={formatDate} comment={item} updateComment={updateComment}
                                            delete={deleteComment}/>
                        })
                    )
                }
            </div>

        </div>
    );
};

export default Post;