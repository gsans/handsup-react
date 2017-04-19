var $ = window.$
const QUESTION_IDS_ITEMS = 10
export const DEFAULT_PROFILE_USERNAME = 'happy-lama'
export const DEFAULT_PROFILE_PIC = 'http://i1.kym-cdn.com/photos/images/original/000/869/487/ccf.png'

export function addToLocalCache(question) {
  let questionsIds = []
  if (localStorage.getItem('questionIds')) {
    questionsIds = JSON.parse(localStorage.getItem('questionIds'))
  }
  questionsIds.push(question.id)
  localStorage.setItem('questionIds', JSON.stringify(questionsIds))
}

export function isDuplicate(questionId) {
  let questionsIds = []
  if (!localStorage.getItem('questionIds')) {
    return false
  }
  questionsIds = JSON.parse(localStorage.getItem('questionIds'))
  // only worry about last x questions
  questionsIds = questionsIds.slice(Math.max(questionsIds.length - QUESTION_IDS_ITEMS, 1))
  return !!questionsIds.find(v => v === questionId)
}

export function normalise(name) {
  return (
    '@' + name.replace(/\s+/g, '-').replace(/[^\w\s]/gi, '').toLowerCase()
  )
}

export function getBaseLog(y) {
  return Math.ceil(Math.log(Math.pow(y+2, 6))/Math.log(5)/5)
}

export function flyingHearts(selector) {
  let rnd = (min, max) => Math.floor(Math.random()*(max - min + 1) + min)
  let id = `heart-${rnd(0, 100)}`
  let waves = ['flying1', 'flying2', 'flying3']
  let colors = ['#e91e63', '#642889', '#00cafe', '#144bcb', '#8bc34a']
  let duration = rnd(1000, 2000)
  let color = colors[rnd(1, 100) % colors.length]
  let size = rnd(20, 50)
  let wave = waves[rnd(1, 100) % waves.length]

  $(`<div class="heart ${id}" style="font-size:${size}px; color:${color};"><i class="fa fa-heart-o"></i><i class="fa fa-heart"></i></div>`)
    .appendTo(`${selector}`)
    .css({ animation: `${wave} ${duration}ms ease-in-out` })
  $(`.${id}`).show()
  setTimeout(() => $(`.${id}`).remove(), duration)
}

export function setUserDetails(auth) {
  return {
    idToken: auth.auth0IdToken,
    name:
      auth.profile.name ||
      DEFAULT_PROFILE_USERNAME,
    username: normalise(
      auth.profile.name ||
      auth.profile.screen_name ||
      DEFAULT_PROFILE_USERNAME,
    ),
    profileUrl:
      auth.profile.picture ||
      DEFAULT_PROFILE_PIC,
    role: 'User',
  }
}
