import {Request, Response} from 'express' 
import knex from '../database/connection'

class PointsController {
    async index(req: Request, res:Response){
        const { city, uf, items } = req.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*'); 

            const serializedPoints = points.map(point => {
                return {
                    ...point,
                    image_url: `http://192.168.1.67:3333/uploads/${point.image}`
                };
            });

        return res.json(serializedPoints)
    }

    async show(req: Request, res: Response){
        const { id } = req.params;
        
        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({ message: "Point not found" });
        }

        const serializedPoint =  {
            ...point,
            image_url: `http://192.168.1.67:3333/uploads/${point.image}`
        };

        const items = await knex('items')
            .join('point_items','items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({ point: serializedPoint,items });
    }


    async create(req: Request, res: Response){
        //get the bodies and insert in constants
        const {
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = req.body;
        
        /*we are doing two inserts, if have a problem in one, going to have a rollback in the other insert,
            to work it, change the command knex to trx in commands*/
        const trx = await knex.transaction()

        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude
        };
            
        //insert the constants in table 
        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

       //insert item an points id in pointItems variable
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                };
            })
        
        //insert pointItems in table
        await trx('point_items').insert(pointItems)
        
        await trx.commit();
        
        return res.json({
            id: point_id,
            ...point
        });
    }
}


export default PointsController;