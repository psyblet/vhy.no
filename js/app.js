// håper ingen som browser reddit har internet explorer :§
function jsonpRequest(url) {
    return new Promise(function(resolve, reject) {
        let script = document.createElement('script')
        const name = "_jsonp_" + Math.round(100000 * Math.random())
        //url formatting
        if (url.match(/\?/)) url += "&jsonp="+name
        else url += "?jsonp="+name
        script.src = url

        window[name] = function(data) {
            resolve(data)
            document.body.removeChild(script)
            delete window[name]
        }

        document.body.appendChild(script)
    })
}

function fromReddit(id, el, domains) {
    id = id || 'from-reddit'
    el = el || 'p'


    this.validKeywords = ['vy', 'nsb', 'tog', 'skandale', 'verden bryter sammen', 'uuuææææææ']

    this.vyDefaultListener = function (e) {
        // mosaicCounter = 0

        var filter = function (post) {
            post = post.data
            var searchRegex = new RegExp(validKeywords.join('|'), 'gi')
            return post.hasOwnProperty('domain') && (
                post.title.search(searchRegex) > -1
            )
        }

        var draw = function (post) {
            post = post.data
            var imageElement = document.createElement(el)
            var titleElement = document.createElement(el)
            var isImage = ['media.makeameme.org', 'i.redd.it', 'i.imgur.com'].indexOf(post.domain) > -1
            var isVideo = post.url.search(new RegExp('.gifv|.webm', 'gi'))
            var videoContentType = 'video/mp4'
            if (isImage) {
                imageElement.innerHTML = '<img src="' + post.url + '" alt="' + post.title + '" />'
            }

            if (isVideo > -1) {
                imageElement.innerHTML = '<video preload="auto" autoplay="autoplay" loop="loop"><source src="' + post.url.replace('gifv', 'mp4') + '" type="' + videoContentType + '"></video>'
            }

            console.log(post.title, post.url, 'video: ' + isVideo, 'image: ' + isImage)

            titleElement.innerHTML = '<a href="https://reddit.com' + post.permalink + '">' + post.title + '</a>'
            titleElement.classList.add('large')

            if (isImage || isVideo > -1) document.getElementById(id).appendChild(imageElement)
            document.getElementById(id).appendChild(titleElement)

            // jeg hater alle som skal lese koden min
            // if (mosaicCounter % 2) {
            //     if (isImage || isVideo > -1) document.getElementById(id).appendChild(imageElement)
            //     document.getElementById(id).appendChild(titleElement)
            // } else {
            //     document.getElementById(id).appendChild(titleElement)
            //     if (isImage || isVideo > -1) document.getElementById(id).appendChild(imageElement)
            // }

            // mosaicCounter++
        }

        e.data.children.filter(filter.bind(this)).forEach(draw.bind(this))
    }

    this.request = function (url, cb) {
        url = url || '/reddit' // 'https://reddit.com/r/norge.json'
        cb = cb || this.vyDefaultListener
        jsonpRequest(url).then(this.vyDefaultListener)
    }

    this.request()

    return this
}

document.addEventListener('DOMContentLoaded', function (e) {
    fromReddit()
})