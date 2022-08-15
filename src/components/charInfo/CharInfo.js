import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

class CharInfo extends Component {
    constructor (props) {
        super(props)

        this.state = {
            char: null,
            loading: false,
            error: false,
            scrollY: false
        }
    }

    marvelService = new MarvelService();

    componentDidMount () {
        this.updateCharacter();
        this.scrollWithContent();
    }

    componentDidUpdate (prevProps) {
        if (this.props.selectedChar !== prevProps.selectedChar) {
            this.updateCharacter();
        }
    }

    updateCharacter = () => {
        const {selectedChar} = this.props;
        if (!selectedChar) {
            return;
        }

        this.setState({loading: true});
        this.setState({error: false});
        this.marvelService
            .getCharacter(this.props.selectedChar)
            .then(char => {
                this.setState({char, loading: false})
            })
            .catch(() => {
                this.setState({loading: false, error: true});
            });
    }

    renderComics = (comics) => {
        if (comics.length < 1) {
            return 'There is no comics for this character';
        }
        return comics.map((item, key) => {
            return (
                <li className="char__comics-item" key={key}>
                    <a target='_blank' href={item.url}>{item.name}</a>
                </li>
            )
        })
    }

    scrollWithContent = () => {
        window.addEventListener('scroll', (e) => {
            if (window.scrollY >= 446) {
                this.setState(({scrollY: true}))
            } else {
                this.setState(({scrollY: false}))
            }
        })
    }

    render() {
        const {char, loading, error, scrollY} = this.state;
        const skeleton = char || error || loading ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div
                className="char__info"
                style={scrollY ? {'position': 'fixed', 'right': '21%', 'marginTop': '15px'} : {'position': 'absolute'}}>
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const charInfo = new CharInfo();

    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'unset'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {charInfo.renderComics(comics)}
            </ul>
        </>
    )
}

export default CharInfo;