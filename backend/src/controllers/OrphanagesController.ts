import { Request, Response } from 'express'

import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Orphanage from '../models/Orphanage'
import OrphanageView from '../views/orphanages_view'

export default {
  async index (request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage)

    const orphanages = await orphanagesRepository.find({ relations: ['images'] })

    return response.json(OrphanageView.renderMany(orphanages))
  },
  async show (request: Request, response: Response) {
    const { id } = request.params
    const orphanagesRepository = getRepository(Orphanage)

    const orphanage = await orphanagesRepository.findOneOrFail(id, { relations: ['images'] })

    return response.json(OrphanageView.render(orphanage))
  },
  async create (request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body

    // eslint-disable-next-line no-undef
    const requestImg = request.files as Express.Multer.File[]
    const images = requestImg.map(image => {
      return { path: image.filename }
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required()
      }))
    })

    await schema.validate(data, { abortEarly: false })

    const orphanagesRepository = getRepository(Orphanage)

    const orphanage = orphanagesRepository.create(data)

    await orphanagesRepository.save(orphanage)

    return response.status(201).json(orphanage)
  }
}