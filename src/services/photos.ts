import { Photo } from "../types/Photo";
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { v4 as createId } from 'uuid';

export const getAll = async ()  => {
    
    let list: Photo[] = [];

    // Primeiro faço a referencia a pasta da imagem
    const imageFolder = ref(storage, 'images');
    
    // Lista todas as imagens da pasta refernciada por imagefolder;
    const photoList = await listAll(imageFolder);

    for (let i in photoList.items) {
        
        // Aqui eu gero um link de donwload para o item
        let photoUrl = await getDownloadURL(photoList.items[i]);

        list.push({
            name: photoList.items[i].name,
            url: photoUrl,
        });
    }



    return list;
}  

export const insert = async (file: File) => {

    if(['image/jpeg', 'image/png','image/jpg'].includes(file.type)){

        let randomName = createId();
        let newFile = ref(storage, `images/${randomName}`);
        let upload = await uploadBytes(newFile, file);

        // Gero o link da foto
        let photoUrl = await getDownloadURL(upload.ref);

        return { name: upload.ref.name,url: photoUrl } as Photo;

    } else {
        return new Error('Tipo d arquivo não permitido.');
    }

}