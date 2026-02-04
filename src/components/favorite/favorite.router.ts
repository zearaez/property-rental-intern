import {
    addToFavoritesHandler,
    getFavoritesHandler,
    removeFromFavoritesHandler,
} from './favorite.controller'
import { authGuard } from '@/middlewares/auth.middleware'
import { Router } from 'express'

const favoriteRouter = Router()

favoriteRouter
    .post('/favorites', authGuard, addToFavoritesHandler)
    .get('/favorites', authGuard, getFavoritesHandler)
    .delete('/favorites/:id', authGuard, removeFromFavoritesHandler)

export default favoriteRouter
