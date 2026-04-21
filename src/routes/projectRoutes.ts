import { Router } from 'express'
import { ProjectController } from '../controllers/ProjectController'
import { body, param } from 'express-validator'
import { handleInputError } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { hasManagerAuthorization, projectExists } from '../middleware/paramMiddleware/project'
import { taskBelongsToProject, taskExists } from '../middleware/paramMiddleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'
import { hasAuthorizationOnNote, noteBelongsToTask, noteExists } from '../middleware/paramMiddleware/note'

const router = Router()

/*****Routes for projects******/

router.use(authenticate) 

router.param('projectId', projectExists)   

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputError,
    ProjectController.createProject)


router.get('/', ProjectController.getAllprojects)

router.get('/:projectId',
    ProjectController.getProjectById)

router.put('/:projectId',
    hasManagerAuthorization,
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputError,
    ProjectController.updateProjectById)

router.delete('/:projectId',
    hasManagerAuthorization,
    ProjectController.deleteProjectById)



/*****Routes for tasks******/

router.param('taskId', taskExists)                  
router.param('taskId', taskBelongsToProject)       
router.param('noteId', noteExists)
router.param('noteId', noteBelongsToTask)


router.post('/:projectId/tasks',

    hasManagerAuthorization, 
    body('name')           
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputError,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getTasks
)

router.get('/:projectId/tasks/:taskId',
    handleInputError,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasManagerAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputError,
    TaskController.updateTaskById
)

router.delete('/:projectId/tasks/:taskId',
    hasManagerAuthorization,
    handleInputError,
    TaskController.deleteTaskById
)

router.patch('/:projectId/tasks/:taskId/status',
    body('status')
        .notEmpty().withMessage('El estado de la tarea es obligatorio'),
    handleInputError,
    TaskController.updateStatus
)

/**Routes for teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().withMessage('El correo electrónico ha de tener un formato válido'),
    handleInputError,
    TeamMemberController.findMemberByEmail
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID de equipo no válido'),
    handleInputError,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:memberId',
    param('projectId').isMongoId().withMessage('ID de proyecto no válido'),
    param('memberId')
        .isMongoId().withMessage('ID de equipo no válido'),
    handleInputError,
    TeamMemberController.deleteMember
)

router.get('/:projectId/team/find-all',
    TeamMemberController.getMembersByProject
)

/**Routes for Notes */

router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputError,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getNotesByTask
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    hasAuthorizationOnNote,
    NoteController.deleteNote
)

export default router