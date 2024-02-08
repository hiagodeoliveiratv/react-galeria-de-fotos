import { useState, useEffect, FormEvent, useRef } from 'react';
import styles from './App.module.css';
import { Photo } from './types/Photo';

import * as Photos from './services/photos';
import { Loading } from './components/Loading';
import { PhotoItem } from './components/PhotoItem';
import { InputType } from 'zlib';

const App = ()=>{

    const [ loading, setLoading ] = useState(true);
    const [ photos, setPhotos ] = useState<Photo[]>([]); 

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        
        const getPhotos = async () => {

            setLoading(true);
            setPhotos(await Photos.getAll());

            if(inputRef.current){
                inputRef.current.value = '';
            }
            
            setLoading(false);
        }

        getPhotos();

    }, []);

    const handleFormSubmit = async ( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const file = formData.get('image') as File;

        if(file && file.size > 0){

            setLoading(true);

            let result = await Photos.insert(file);

            if(result instanceof Error){
                alert(`${result.name}:${result.message}`);
            } else {

                setPhotos([...photos, result]);
                
            }

            setLoading(false);

        }

        
    }

    return (
        <div className={styles.container}>
            <div className={styles.main}>

                <header className={styles.header}>
                    <h1>Galeria de fotos</h1>
                </header>

                <form 
                    className={styles.form}
                    method='POST'
                    onSubmit={handleFormSubmit}
                >

                    <input type="file" ref={inputRef} name='image' />
                    <input type="submit" value="Enviar" />

                </form>

                {loading &&
                   <Loading />
                }
                {!loading && photos.length > 0 &&
                    <div className={styles.photoGrid}>
                        {photos.map((photo, index) =>(
                            <PhotoItem
                                key={index}
                                photo={photo}
                            />
                        ))}
                    </div>
                }
                {!loading && photos.length === 0 &&
                    <div>
                        Não há fotos cadastradas.
                    </div>
                }
            </div>
        </div>
    )
}

export default App;