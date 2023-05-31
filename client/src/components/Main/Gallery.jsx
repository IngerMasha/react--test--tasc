import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../UserContext";
import Post from "./Post/Post";
import '../Main/styles/gallery.css'

const Gallery = () => {
    const {userLogin, posts, setPosts, MAIN_URL} = useContext(UserContext);
    const [newPostIsActive, setNewPostIsActive] = useState(false)
    const[keyWord,setKeyWord]=useState('')
    const [postTitle, setPostTitle] = useState('')
    const [allPosts, setAllPosts] = useState([]);
    const [countClientPage, setCountClientPage] = useState(1);
     useEffect(() => {
            getAllPosts();
        }, [countClientPage]);
    function createPost(title, username) {
        const post = {title, username};
        fetch(`${MAIN_URL}post/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(newPost => {
                setPosts(prevPosts => [...prevPosts, newPost]);
                getAllPosts()
            })
            .catch(error => {
                console.error(error);
            });
    }
    const handleDeletePost = (id) => {
        fetch(`${MAIN_URL}post/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(deletedPost => {
                setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPost.id));
                getAllPosts()
            })
            .catch(error => {
                console.error(error);
            });

    }
    const updatePost = (postId, updatedData) => {
        fetch(`${MAIN_URL}post/${postId}`, {
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
            .then(updatedPost => {
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post.id === updatedPost.id
                            ? {
                                ...post,
                                likes: updatedPost.likes,
                                dislikes: updatedPost.dislikes,
                                title: updatedPost.title,
                                comments: updatedPost.comments,
                                imageSrc: updatedPost.imageSrc
                            }
                            : post
                    )
                );
            })
            .catch(error => {
                console.error(error);
            });
    };

    function getAllPosts() {
        fetch(`${MAIN_URL}post/page/${countClientPage}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(Posts=>{
                setAllPosts(Posts.result)

            })
            .catch(error => {
                console.error(error);
            });
    }
    function nextPage() {

        setCountClientPage(prevCountClientPage => prevCountClientPage + 1);

    }

    function prevPage() {
        if (countClientPage > 1) {
            setCountClientPage(prevCountClientPage => prevCountClientPage - 1);
        }
    }

    const handlerNewPostButton = () => {
        setNewPostIsActive(true)
    }
    const handleCreatePost = () => {
        createPost(postTitle, userLogin);
        setNewPostIsActive(false);
        setPostTitle('');
    };
    const handleCancelNewPost = () => {
        setNewPostIsActive(false);
        setPostTitle('');
    };
    function handleSearch() {
    searchByKeyword(keyWord);
    }

    function searchByKeyword(keyword) {
        if (keyword.trim() === '') {
            getAllPosts();
            return;
        }
        fetch(`${MAIN_URL}post/search/${keyword}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(posts => {
                setAllPosts(posts.result)
            })
            .catch(error => {
                console.error(error);
            });

    }

    return (
        <div className={'gallery'}>
            <div className={'searchSection'}>
                <input type={"text"} placeholder={"Search..."} onChange={(e)=>setKeyWord(e.target.value)}/>
                <button onClick={handleSearch}>Search</button>
                <button onClick={handlerNewPostButton}>New Post</button>
                {
                    newPostIsActive && (<div className={'newPostZone'}>
                            <input
                                type={"text"}
                                placeholder={"title"}
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}/>
                            <button onClick={handleCancelNewPost}>cancel</button>
                            <button onClick={handleCreatePost}>Ok</button>
                        </div>
                    )
                }
            </div>
            <div className={'page'}>
                <button onClick={prevPage}>Prev</button>
                <div className={'posts'}>
                    {
                        Array.isArray(posts) ? (
                            allPosts.map((item, index) => (
                                <Post key={index} post={item} delete={handleDeletePost} updatePost={updatePost}/>
                            ))
                        ) : (
                            <p>Loading posts...</p>
                        )
                    }
                </div>
                <button onClick={nextPage}>Next</button>
                {/*<button onClick={() => handlerPageChange(1)}>Next</button>*/}
            </div>
        </div>

    );
};

export default Gallery;