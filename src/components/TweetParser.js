import React from 'react'

class TweetParser extends React.Component {

  generateLink(url, urlClass, target, text) {
    return `<a href="${url}" class="${urlClass}" target="${target}">${text}</a>`
  }

  render() {
    const {
      urlClass,
      userClass,
      hashtagClass,
      target,
      searchWithHashtags,
      parseUsers,
      parseUrls,
      parseHashtags,
    } = this.props

    const REGEX_URL = /(?:\s)(f|ht)tps?:\/\/([^\s\t\r\n<]*[^\s\t\r\n<)*_,\.])/g // regex for urls
    const REGEX_USER = /\B@([a-zA-Z0-9_]+)/g // regex for @users
    const REGEX_HASHTAG = /\B(#[Ã¡-ÃºÃ-ÃÃ¤-Ã¼Ã-Ãa-zA-Z0-9_]+)/g // regex for #hashtags

    let tweet = this.props.children
    let searchlink // search link for hashtags
    // Hashtag Search link
    if (searchWithHashtags) {
      // this is the search with hashtag
      searchlink = 'https://twitter.com/hashtag/'
    } else {
      // this is a more global search including hashtags and the word itself
      searchlink = 'https://twitter.com/search?q='
    }
    // turn URLS in the tweet into... working urls
    if (parseUrls) {
      tweet = tweet.replace(REGEX_URL, url => {
        let link = this.generateLink(url, urlClass, target, url)
        return url.replace(url, link)
      })
    }
    // turn @users in the tweet into... working urls
    if (parseUsers) {
      tweet = tweet.replace(REGEX_USER, user => {
        let userOnly = user.slice(1)
        let url = `http://twitter.com/${userOnly}`
        let link = this.generateLink(url, userClass, target, user)
        return user.replace(user, link)
      })
    }
    // turn #hashtags in the tweet into... working urls
    if (parseHashtags) {
      tweet = tweet.replace(REGEX_HASHTAG, hashtag => {
        let hashtagOnly = hashtag.slice(1)
        let url = searchlink + hashtagOnly
        let link = this.generateLink(url, hashtagClass, target, hashtag)
        return hashtag.replace(hashtag, link)
      })
    }

    return <div dangerouslySetInnerHTML={{ __html: tweet }} />
  }
}

TweetParser.propTypes = {
  urlClass: React.PropTypes.string,
  userClass: React.PropTypes.string,
  hashtagClass: React.PropTypes.string,
  target: React.PropTypes.string,
  searchWithHashtags: React.PropTypes.bool,
  parseUsers: React.PropTypes.bool,
  parseUrls: React.PropTypes.bool,
  parseHashtags: React.PropTypes.bool,
}

TweetParser.defaultProps = {
  urlClass: 'react-tweet-parser__url',
  userClass: 'react-tweet-parser__user',
  hashtagClass: 'react-tweet-parser__hashTag',
  target: '_blank',
  searchWithHashtags: true,
  parseUsers: true,
  parseUrls: true,
  parseHashtags: true,
}

export default TweetParser
