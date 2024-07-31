const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body; 
        const user_id = request.user.id;
        
        if (!title || !description || !rating) {
            return response.status(400).json({ error: "All fields are required" });
        }

        try {
            const [note_id] = await knex("notes").insert({
                title,
                description,
                rating,
                user_id,
                created_at: knex.fn.now(),
                updated_at: knex.fn.now()
            });

            const tagsInsert = tags.map(name => {
                return {
                    note_id: note_id,
                    name,
                    user_id
                };
            });

            await knex("tags").insert(tagsInsert);

            return response.status(201).json({ message: "Note created successfully" });
        } catch (error) {
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }

    async show(request, response) {
        const { id } = request.params;

        const note = await knex("notes").where({ id }).first();
        const tags = await knex("tags").where({ note_id: id }).orderBy("name");

        return response.json({
            ...note,
            tags
        }); 
    }

    async delete(request, response){
        const { id } = request.params;
        
        await knex("notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response){
        const { title, tags } = request.query;
        const user_id = request.user.id;

        let notes;

        if(tags){
            const filterTags = tags.split(',').map(tag => tag.trim());

            notes = await knex("tags")
            .select([
                "notes.id",
                "notes.title",
                "notes.user_id",
                "notes.created_at"
            ])
            .where("notes.user_id", user_id)
            .whereLike("notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("notes", "notes.id", "tags.note_id")
            .groupBy("note.id")
            .orderBy("notes.title")

        } else {
        notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
        .select("id", "rating", "title", "description", "created_at", "user_id");
        }
        const userTags = await knex("tags").where({ user_id });
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                tags: noteTags
            }
        })

        return response.json(notesWithTags);
    }
}

module.exports = NotesController;