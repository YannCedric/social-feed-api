const {
  Find,
  FindWithPaging,
  FindOne,
  FindById,
  Update,
  FindAllByIds,
  Create,
  DeleteOne,
} = require('../db')

class Posts {
  static async PostCreate(user) {
    return Create('posts', user)
  }
  static async PostUpdate(data) {
    return Update('posts', data)
  }
  static async PostDelete({ postId: _id, deleterId }) {
    const post = await FindOne("posts", { _id })
    if (!post.authorId.equals(deleterId)) {
      throw Error("User doesn't have the right to delete this post.")
    } else
      return DeleteOne('posts', _id)
  }
  static async UpdateComment({ id, text, picture, editorId }) {
    const comment = await FindById('comments', id)
    if (!comment) {
      throw Error("Comment doesn't exist !.")
    } else if (!comment.authorId.equals(editorId)) {
      throw Error("User doesn't have the right to edit this comment.")
    } else
      return Update('comments', { id, text, picture })
  }
  static async CommentCreate(data) {
    const newComment = await Create('comments', data)
    Update('posts', { id: newComment.postId, $push: { commentsIds: newComment.id } })
    return newComment
  }
  static async FindPosts(query) {
    return Find('posts', query)
  }
  static async FindPostsWithPaging(from, limit) {
    return FindWithPaging('posts', from, limit)
  }
  static async FindPostById(id) {
    return FindById('posts', id)
  }
  static async FindAllPostsByIds(ids) {
    return FindAllByIds('posts', ids)
  }
  static async PostLike({ postId, likerId }) {
    return Update('posts', {
      id: postId,
      $pull: { dislikersIds: likerId },
      $addToSet: { likersIds: likerId }
    })
  }
  static async CommentLike({ commentId, likerId }) {
    return Update('comments', {
      id: commentId,
      $pull: { dislikersIds: likerId },
      $addToSet: { likersIds: likerId }
    })
  }
  static async CommentDisLike({ commentId, dislikerId }) {
    return Update('comments', {
      id: commentId,
      $pull: { likersIds: dislikerId },
      $addToSet: { dislikersIds: dislikerId }
    })
  }
  static async CommentDelete({ commentId, deleterId }) {
    const comment = await FindById('comments', commentId)
    if (!comment) {
      throw Error("Comment doesn't exist !.")
    } else if (!comment.authorId.equals(deleterId)) {
      throw Error("User doesn't have the right to delete this comment.")
    } else
      return DeleteOne('comments', commentId)
  }
  static async PostDislike({ postId, likerId }) {
    return Update('posts', {
      id: postId,
      $pull: { likersIds: likerId },
      $addToSet: { dislikersIds: likerId }
    })
  }
  static async GetAllCommentsByIds(ids) {
    return FindAllByIds('comments', ids)
  }
}

module.exports = Posts