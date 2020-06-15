import { Request, Response } from 'express' 
import knex from '../database/connection'

//Request params -> pôe na rota
//Request body -> criação e edição
//Query Params -> Paginação/filtro

class pointsController{
    async index(req: Request, res: Response){
        // city, uf, items (Query Params)
        const {city, uf, items} = req.query
        
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))
        
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('points.city', String(city))
            .where('points.uf', String(uf))
            .distinct()
            .select('points.*')

            console.log(city, uf, items)
        return res.json(points)
    }

    async show(req: Request, res: Response){
        const { id } = req.params
        const point = await knex('points').where('id', id).first()
        
        if(!point){
            return res.status(400).json({message: 'Point not found'})
        }

        const items = await knex('items')
          .join('point_items', 'items.id', '=', 'point_items.item_id')
          .where('point_items.point_id', id)
          .select('items.title')

        return res.json({ point, items })
    }

    async create(req: Request, res: Response){
        const {
            name,
            email,
            whatsapp,
            latitude, 
            longitude,
            city,
            uf,
            items
        } = req.body;
    
        //criando uma transaction para efetuar o rollback da operação, quase que um smart restar
        const trx = await knex.transaction();
        
        const point = {
            image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude, 
            longitude,
            city,
            uf,
        }

        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items.map((item_id: number) => {
            return {
                point_id,
                item_id
            }
        });
    
        await trx('point_items').insert(pointItems) ;       
        
        //efetua o commit e salva no BD
        await trx.commit()

        return res.json({
            id: point_id,
            ...point,
            pointItems
        })
    }
}

export default pointsController