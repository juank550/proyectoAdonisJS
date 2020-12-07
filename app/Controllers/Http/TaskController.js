'use strict'

class TaskController {
}

module.exports = TaskController

const Task = use('App/Models/Task')

async index ({ view }) {
    const tasks = await Task.all()
    return view.render('tasks.index', { tasks: tasks.toJSON() })
}

const { validate } = use('Validator')

async store ({ request, response, session}) {
    //Validacion para datos de entrada
    const validation = await validate(request.all(), {
        title: 'required|min:3|max:255'
    })

    //Mostrar mensajes de error si falla la validacion
    if (validation.fails()) {
        session.withErrors(validation.messages())
                .flashAll()
                return response.redirect('back')
    }

    //Guardar en la base de datos

    const task = new Task()
    task.title = request.input('title')
    await task.save()

    //Guardar mensaje de exito

    session.flash({ notification: 'Tarea agregada con exito' })

    return response.redirect('back')

}
