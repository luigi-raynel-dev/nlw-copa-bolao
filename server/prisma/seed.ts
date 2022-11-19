import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
    const user = await prisma.user.create({
        data: {
            name: 'Jonh Doe',
            email: 'jonh.doe@gmail.com',
            avatarUrl: 'https://github.com/luigi-raynel-dev.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Bolão do Jonh Doe',
            code: 'BOL123',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-24T16:00:00.593Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR'
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-25T16:00:00.593Z',
            firstTeamCountryCode: 'AR',
            secondTeamCountryCode: 'US',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 0,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })

}

main()