import styles from './PhotoItem.module.css';
import { Photo } from '../../types/Photo';

type Props = {
    photo: Photo;
}
export const PhotoItem = ( { photo } : Props )=>{
    return (
        <div className={styles.photoItem}>
            <img src={photo.url} alt={photo.name} />
            <p>{photo.name}</p>
        </div>
    )
}