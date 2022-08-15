class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = '9217f781c7130c78bf011ee9c489981d';
	_baseCharacterOffset = 210;

	getResource = async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	}

	getAllCharacters = async (offset = this._baseCharacterOffset) => {
		const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&apikey=${this._apiKey}`);
		return res.data.results.map(this._transformApiData);
	}

	getCharacter = async (id) => {
		const res = await this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);
		return this._transformApiData(res.data.results[0], await this.getCharacterComics(id));
	}

	getCharacterComics = async (charId) => {
		const res = await this.getResource(`${this._apiBase}/characters/${charId}/comics?limit=10&apikey=${this._apiKey}`);
		return res.data.results.map(this._transformComicsData);
	}

	_transformComicsData = (comics) => {
		return {
			name: comics.title,
			url: comics.urls[0].url
		}
	}

	_transformApiData = (char, comics) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: comics
		}
	}
}

export default MarvelService;