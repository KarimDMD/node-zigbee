var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports.watcher = async function (fn){
    const docRef = db.collection('/rooms/1/lights');
    
    docRef.onSnapshot(docs=>{
        docs.forEach(doc=>{
            let d = doc.data();
            if(d.active) {
                fn("D"+d.id.toString());
                console.log('t la ', d );
            }
        })
    })

}