const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');

const auth = require("../../middleware/auth");

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find();

        res.json({ data: { posts: posts } });
    } catch (e) {
        res.status(404).json({ message: 'Get All Posts Failed!', error: e });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        res.json({ data: { post: post } });
    } catch (e) {
        res.status(404).json({ message: 'No Post found!', error: e });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newPost = {...req.body, owner: req.user.id};
        const post = await Post.create(newPost);

        res.json({ message: 'Post added successfully!', data: { post: post } });
    } catch (e) {
        res.status(404).json({ message: 'Unable to add this post!', error: e });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post.owner == req.user.id) res.json({ message: 'Not allow to update this post!' });

        const result = await post.updateOne(req.body);

        res.json({ message: 'Post updated successfully!', data: { post: result } });
    } catch (e) {
        res.status(404).json({ message: 'Unable to update this post!', error: e });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post.owner == req.user.id) res.json({ message: 'Not allow to delete this post!' });

        const result = await post.remove();

        res.json({ message: 'Post deleted successfully!', data: { post: result } });
    } catch (e) {
        res.status(404).json({ message: 'Unable to delete this post!', error: e });
    }
});

module.exports = router;