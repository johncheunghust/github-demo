import MarkdownIt from "markdown-it";
import 'github-markdown-css'
import {memo, useMemo} from 'react'

const md = new MarkdownIt({
    html: true,
    linkify: true,
})

function b64_to_utf8(str) {
    return decodeURIComponent(escape(atob(str)))
}

export default memo(function MarkdownRenderer({content, isBased64}) {
    const markdown = isBased64 ? b64_to_utf8(content) : content;

    const html = useMemo(()=>md.render(markdown), [markdown])  ;

    return (
        <div className="markdown-body">
        <div dangerouslySetInnerHTML={{__html: html}}></div>
    </div>
    )
})