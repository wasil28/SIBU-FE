import { handleApiError } from '~/utils/error.handler'

const instance = useApiMaster();

export const LeaderboardApi = {
  getAllData: async (token: any) => {
    return withoutLoading(async () => {
      try {
        const response = await instance.get('/leaderboard', {          
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        return response.data
      }
      catch (error) {
        handleApiError(error)
        throw error
      }
    })
  },
  getByUpbjj: async (upbjjName: any, token: any) => {
    return withoutLoading(async () => {
      try {
        const response = await instance.get(`/leaderboard/${upbjjName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        return response.data
      }
      catch (error) {
        handleApiError(error)
        throw error
      }
    })
  },
}