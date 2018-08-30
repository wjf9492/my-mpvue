import fly from './api'
// import qs from 'qs'

// 获取课程列表
export function getCourseList () {
  const url = '/courses'
  return fly.get(
    url,
    null,
    {method: 'get'}
  )
}

// 获取热门课程
export function getHotCourses () {
  const url = '/courses/recommended'
  return fly.get(
    url,
    null,
    {method: 'get'}
  )
}
