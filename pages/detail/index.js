
import api from '../../lib/api'
import withRepoBasic from '../../components/with-repo-basic'

import dynamic from 'next/dynamic'

const MDRenderer = dynamic(()=>import('../../components/MarkdownRenderer'),
    {
        loading: () => <p>Loading</p>
    })






function Index({readme}) {

    return <MDRenderer content={readme.content} isBased64={true} />
}

Index.getInitialProps = async({ctx:{query: {owner, name}, req, res}, }) => {
    const readmeResp = await api.request({
        url: `/repos/${owner}/${name}/readme`
    }, req, res)

    console.log(readmeResp.data);

    return {
        readme: readmeResp.data
    }
}

export default withRepoBasic(Index, 'index')