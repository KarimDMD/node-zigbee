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

module.exports.updater = async function(id){
    const docRef = db.collection('/rooms/1/lights');

    let docs = await docRef.get();
    docs.docs.forEach((d) => {
        const doc = d.data();
        d.ref.update({active : (d.data().id === id)});    
    })
}