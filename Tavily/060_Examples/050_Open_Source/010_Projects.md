> 원본: https://docs.tavily.com/examples/open-sources/projects.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Projects

> Explore our collection of popular open source projects that showcase Tavily's use cases and capabilities.

## Open source projects using Tavily

* [assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher)
* [kortix-ai/suna](https://github.com/kortix-ai/suna)
* [bytedance/deer-flow](https://github.com/bytedance/deer-flow)
* [langchain-ai/open\_deep\_research](https://github.com/langchain-ai/open_deep_research)
* [miurla/morphic](https://github.com/miurla/morphic)
* [meta-llama/llama-stack-apps](https://github.com/meta-llama/llama-stack-apps)
* [rotemweiss57/gpt-newspaper](https://github.com/rotemweiss57/gpt-newspaper)
* [Darwin-lfl/langmanus](https://github.com/Darwin-lfl/langmanus)
* [aws-samples/bedrock-engineer](https://github.com/aws-samples/bedrock-engineer)
* [togethercomputer/open\_deep\_research](https://github.com/togethercomputer/open_deep_research)
* [CopilotKit/open-research-ANA](https://github.com/CopilotKit/open-research-ANA)
* [aws-samples/sample-bedrock-deep-researcher](https://github.com/aws-samples/sample-bedrock-deep-researcher)
* [NVIDIA-AI-Blueprints/biomedical-aiq-research-agent](https://github.com/NVIDIA-AI-Blueprints/biomedical-aiq-research-agent)

export const GitHubRepoCard = ({repoData, repoUrl, isLoading}) => {
  if (isLoading) {
    return <div className="group relative block bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>;
  }
  if (!repoData) {
    return <div className="group relative block bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
    Repository data unavailable
  </p>
  <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#fdbb11] hover:underline inline-block">
    View on GitHub →
  </a>
</div>;
  }
  const formatNumber = num => {
    const parsed = typeof num === 'string' ? parseInt(num) : num;
    if (parsed >= 1000000) return (parsed / 1000000).toFixed(1) + 'M';
    if (parsed >= 1000) return (parsed / 1000).toFixed(1) + 'K';
    return parsed.toString();
  };
  return <a href={repoData.url || repoUrl} target="\_blank" rel="noopener noreferrer" className="group relative flex flex-col bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#fdbb11] dark:hover:border-[#fdbb11] transition-all duration-200">
<div className="flex items-center gap-3 mb-2">
{repoData.avatar && <img src={repoData.avatar} alt={repoData.owner} className="w-8 h-8 rounded flex-shrink-0" />}
<div className="flex-1 min-w-0 flex items-center justify-between gap-2">
<p className="text-sm leading-none truncate">
<span className="text-gray-500 dark:text-gray-400 font-medium">
{repoData.owner}/
</span>
<span className="text-gray-900 dark:text-gray-100 font-semibold">
{repoData.name}
</span>
</p>
<svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#fdbb11] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
</svg>
</div>
</div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2.5 line-clamp-2 leading-relaxed flex-grow">
        {repoData.description || 'No description available'}
      </p>

      <div className="mt-auto flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{formatNumber(repoData.stars)}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
          </svg>
          <span>{formatNumber(repoData.forks)}</span>
        </div>
      </div>
    </a>;
};

export const GitHubReposGrid = () => {
  const [repos, setRepos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const repoUrls = ["https://github.com/assafelovic/gpt-researcher", "https://github.com/kortix-ai/suna", "https://github.com/bytedance/deer-flow", "https://github.com/langchain-ai/open_deep_research", "https://github.com/miurla/morphic", "https://github.com/meta-llama/llama-stack-apps", "https://github.com/rotemweiss57/gpt-newspaper", "https://github.com/Darwin-lfl/langmanus", "https://github.com/aws-samples/bedrock-engineer", "https://github.com/togethercomputer/open_deep_research", "https://github.com/CopilotKit/open-research-ANA", "https://github.com/aws-samples/sample-bedrock-deep-researcher", "https://github.com/NVIDIA-AI-Blueprints/biomedical-aiq-research-agent"];
  React.useEffect(() => {
    const API_URL = 'https://app.tavily.com/api/get-repo-metadata';
    fetch(API_URL).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    }).then(data => {
      if (data.results) {
        const sortedRepos = data.results.sort((a, b) => {
          const starsA = parseInt(a.stars) || 0;
          const starsB = parseInt(b.stars) || 0;
          return starsB - starsA;
        });
        const mappedRepos = sortedRepos.map(repo => {
          const avatar = repo.contributors && repo.contributors[0] ? repo.contributors[0].avatar_url : '';
          return {
            owner: repo.owner,
            name: repo.name,
            description: repo.description || 'No description available',
            stars: parseInt(repo.stars) || 0,
            forks: parseInt(repo.forksCount) || 0,
            avatar: avatar,
            url: repo.url
          };
        });
        setRepos(mappedRepos);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch repo data:', err);
      setError(true);
      setLoading(false);
    });
  }, []);
  if (error) {
    return <div className="text-center py-12">
  <p className="text-gray-600 dark:text-gray-400 mb-4">
    Unable to load repository data. Please try again later.
  </p>
  <a href="https://github.com/topics/tavily" target="_blank" rel="noopener noreferrer" className="text-[#fdbb11] hover:underline">
    Browse projects on GitHub →
  </a>
</div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
{repoUrls.map((repoUrl, index) => {
    const repoPath = repoUrl.replace('https://github.com/', '');
    const [owner, name] = repoPath.split('/');
    const repoData = repos.find(r => r.owner?.toLowerCase() === owner?.toLowerCase() && r.name?.toLowerCase() === name?.toLowerCase());
    return <GitHubRepoCard key={index} repoUrl={repoUrl} repoData={repoData} isLoading={loading} />;
  })}
    </div>;
};

<GitHubReposGrid />
