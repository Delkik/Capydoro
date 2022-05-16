import express, { Application, Request, Response, NextFunction } from 'express'
import {getFirestore, FieldValue} from 'firebase-admin/firestore'
import admin from "firebase-admin"
import {getAuth} from 'firebase-admin/auth'
import cors from 'cors'


/*
To Do:
    /tasks/id
    /friends/add/id
    /friends/remove/id
    /friends/read

    src/routes folder

*/





admin.initializeApp({
    credential: admin.credential.cert("serviceAccountKey.json")
});

const PORT = 5000
const db = getFirestore()
const app = express()

const verifyUser = async (token:string) => {
    let uid
    try {
        const decodedToken = await getAuth()
            .verifyIdToken(token);
        uid = decodedToken.uid;
        return uid;
    } catch (error) {
        return null;
    }
}

app.use(cors())
app.use(express.json())

//Main route
app.get("/",(req: Request, res: Response) => {
    res.status(200).send("It's up.")
})

//Sign up
app.get("/signup", async (req: Request, res: Response) => {
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
	else{
		const userDoc = db.collection('users').doc(user)
		const doc = await userDoc.get()
		if (!doc.exists){
			await userDoc.set({
				"friends":[],
				"tasks":[],
				"exp": 0,
				"level":1
			})
			res.status(200).send("Signed Up")
		}
		else{
			res.status(200).send("Signed In")
		}
	}

})

//
app.get("/tasks", cors(), async (req: Request, res: Response, next:NextFunction) => {
  	const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
	else{
		const userDoc = db.collection('users').doc(user)
        const doc = await userDoc.get()
		if (!doc.exists){
            res.status(400).send("Failed")
        }
        else{
            const tasks = doc.get("tasks")
            res.status(200).send(tasks)
        }
	}
})

//
app.put("/tasks/update/:id", cors(), async (req: Request, res: Response) => {
    const id = req.params.id
    const data = req.body
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
    else{
        const userDoc = db.collection('users').doc(user)
        const doc = await userDoc.get()
		if (!doc.exists){
            res.status(400).send("Failed")
        }
        else{
            let level = doc.get("level")
            let xp = doc.get("exp")
            let tasks = doc.get("tasks")
            console.log(level,xp,data,tasks)
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i]["id"]===id){
                    if (data["status"] == 2 && tasks["status"] != 2){
                        xp += 15
                        let testXp=(level+1)**3 - xp
                        if (testXp < 0){
                            xp = testXp * -1
                            level+=1
                        }
                        userDoc.update({"exp":xp})
                        userDoc.update({"level":level})
                    }
                    tasks[i] = data
                    console.log(tasks)
                    console.log("=============")
                    await userDoc.update({"tasks":tasks})
                }
                
            }
            res.status(200).send("")
        }
    }
})

//Create a new task
app.post("/tasks/create", cors(), async (req: Request, res: Response) => {
    const data = req.body
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
    else{
        const userDoc = db.collection('users').doc(user)
        await userDoc.update({"tasks":FieldValue.arrayUnion(data)})
        res.status(201).send("")
    }
})

//
app.delete("/tasks/delete/:id", cors(), async (req: Request, res: Response) => {
    const id = req.params.id
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
    else{
        const userDoc = db.collection('users').doc(user)
        const doc = await userDoc.get()
		if (!doc.exists){
            res.status(400).send("Failed")
        }
        else{
            let tasks = doc.get("tasks")
            tasks = tasks.filter( (value: { id: string }) => value.id !== id )
            await userDoc.update({"tasks":tasks})
            res.status(200).send(tasks)
        }
    }
})

//
app.get("/tasks/:id", cors(), async (req: Request, res: Response) => {
    const id = req.params.id
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
    else{
        
    }
})


//
app.post("/friends/add/:id", cors(), async (req: Request, res: Response) => {
    const id = req.params.id
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
    else{
        
    }
})

//
app.delete("/friends/remove/:id", cors(), async (req: Request, res: Response) => {
    const id = req.params.id
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
    else{
        
    }
})

//
app.get("/friends/read", cors(), async (req: Request, res: Response) => {
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
    else{
        const userDoc = db.collection('users').doc(user)
        const doc = await userDoc.get()
		if (!doc.exists){
            res.status(400).send("Failed")
        }
        else{
            const friends = doc.get("friends")
            // const xp = doc.data()?["xp"]:""
            res.status(200).send(friends)
        }
    }
})

//
app.get("/level", cors(), async (req: Request, res: Response) => {
    console.log("please work")
    const token = req.headers.authorization
    const user = await verifyUser(typeof token==="string"?token:"")
    if (!user){
        res.status(400).send("Failed")
    }
    else{
        const userDoc = db.collection('users').doc(user)
        const doc = await userDoc.get()
		if (!doc.exists){
            res.status(400).send("Failed")
        }
        else{
            const lev = doc.get("level")
            const xp = doc.get("exp")
            res.status(200).send({"level":lev,"xp":xp})
        }
    }
})

app.listen(
    process.env.PORT || PORT,
    () => console.log("It's up on port", process.env.PORT || PORT)
)