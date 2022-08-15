import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    constructor (props) {
        super(props)

        this.state = {
            charList: [],
            loading: true,
            error: false,
            offset: 210,
            newItemLoading: false,
            charEnded: false
        }
    }

    marvelServices = new MarvelService();

    getCharacters = (offset) => {
        this.setState(({newItemLoading: true}));

        this.marvelServices
            .getAllCharacters(offset)
            .then(newCharList => {
                let charListEnd = false;
                if (newCharList.length < 9) {
                    charListEnd = true;
                }

                this.setState(({charList, offset}) => ({
                    charList: [...charList, ...newCharList],
                    loading: false,
                    offset: offset + 9,
                    newItemLoading: false,
                    charEnded: charListEnd
                }));
            })
            .catch(() => {
                this.setState(({error: true, loading: false}))
            });
    }

    componentDidMount() {
        this.getCharacters();
    }

    itemsRef = [];

    setRef = (ref) => {
        this.itemsRef.push(ref)
    }

    focusOnItem = (index) => {
        this.itemsRef.forEach(item => item.classList.remove('char__item_selected'));
        this.itemsRef[index].classList.add('char__item_selected');
        this.itemsRef[index].focus();
    }

    renderItems = (charlist) => {
        const items = charlist.map((item, i) => {

            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (
                <li
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? this.renderItems(charList) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    onClick={() => this.getCharacters(offset)}
                    disabled={newItemLoading}
                    style={{'display' : charEnded ? 'none' : 'block'}}
                    className={newItemLoading ? 'button button__main button__long pulse' : 'button button__main button__long'}>
                    <div className="inner">{newItemLoading ? 'loading...' : 'load more'}</div>
                </button>
            </div>
        )
    }
}

export default CharList;