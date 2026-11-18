import { useEffect, useRef, useState } from 'react';
import './App.css';

const sourceUrl = 'https://github.com/mojtabafazeli/relay';

const docsUrl = `${sourceUrl}/blob/main/README.md`;
const productGuideUrl = `${sourceUrl}/blob/main/docs/guide-for-product-owners.md`;

const workflow = [
  { number: '01', title: 'Request & story', detail: 'Describe the outcome in REQUEST.md. The product-owner agent writes USER_STORY.md; product and developer reviewers check it.' },
  { number: '02', title: 'Human approval', detail: 'Read the story and approve its scope before planning and coding begin. Rejection ends the default run.' },
  { number: '03', title: 'Plan & build', detail: 'The lead writes TASKS.md. After plan review, the coder works one task at a time, with checks and up to two retries per task.' },
  { number: '04', title: 'Review & decide', detail: 'Reviewers inspect the committed Git diff. You inspect the run branch and approve the final result; a developer handles merging and release.' },
];

const features = [
  { icon: 'workflow', title: 'Review the actual work', description: 'Reviewers take turns on stories, task lists, and Git diffs. Approvals belong to an exact revision; a new revision needs fresh approvals.' },
  { icon: 'branches', title: 'Commits you can inspect', description: 'The feature workflow commits each passing task on relay/<run-id> and leaves the checkout there for inspection. Relay never pushes or merges.' },
  { icon: 'resume', title: 'Continue after interruption', description: 'Resume eligible stopped, failed, or interrupted runs after reviewing a recovery summary. Saved configuration, completed tasks, elapsed time, and recorded spend carry forward.' },
  { icon: 'protected', title: 'Protect project paths', description: 'Add protected patterns for CI files, migrations, or other sensitive paths. Environment files are protected by default. Post-turn violations stop the run and block resume.' },
  { icon: 'budgets', title: 'Time and spend limits', description: 'Set run and turn timeouts, plus run, stage, and agent spend limits. Spend checks happen between turns for metered agents; one turn can exceed a limit.' },
  { icon: 'records', title: 'A local run journal', description: 'Configuration, state, decisions, snapshots, and turn records live in .relay/runs/<id>/. Inspect progress through the CLI or Claude Code plugin.' },
];

const commands = [
  ['relay init', 'Guided setup; or choose --template example, story-review, or feature'],
  ['relay validate', 'Check configuration and required tools'],
  ['relay agents test', 'Send configured AI agents a read-only test prompt'],
  ['relay run', 'Review access and start in the terminal'],
  ['relay summary', 'Reserve a run summary and confirmation digest'],
  ['relay run --confirm <digest>', 'Start the reserved run if the summary still matches'],
  ['relay status', 'Inspect progress and pending questions'],
  ['relay answer <id> <question-id> <choice>', 'Answer a current question for a run using --answers'],
  ['relay stop <id>', 'Request a stop, including while waiting for an answer'],
  ['relay resume <id>', 'Inspect and confirm an eligible recovery'],
  ['relay status --json', 'Read machine-readable run status'],
];

const roadmap = [
  { title: 'Local browser UI · planned', description: 'A request form, live run view, artifact reading, and gate decisions in the browser. Today, use the CLI or Claude Code plugin.' },
  { title: 'Adapter discovery · after v1', description: 'Automatic discovery of external adapters is deferred. Configure the built-in CLI and API adapters explicitly today.' },
];

const faqs = [
  { question: 'Which agents can I use?', answer: 'Claude Code (claude-cli), Codex (codex-cli), generic command-line agents, scripts, and humans. Direct API adapters support Anthropic Messages and OpenAI-compatible Chat Completions endpoints, including local loopback endpoints.' },
  { question: 'Does Relay merge or release my feature?', answer: 'No. The feature workflow creates relay/<run-id>, commits passing tasks, and leaves your checkout on that branch. Final human approval completes the run; a developer still reviews, merges, and releases the result.' },
  { question: 'What does it cost?', answer: 'The package is private and is not published to npm. CLI agents use your existing authentication and quota; API agents use your configured endpoint and API key. Spend limits use recorded usage between turns, and totals are marked partial when usage is unmetered or unknown. Relay ships without built-in model prices.' },
  { question: 'Can authors and reviewers use different models?', answer: 'Yes. Configure separate agents with their own adapters and model IDs. Reviewers run read-only. API agents can review supplied content or write a declared artifact, but they cannot execute local coding tasks or author Git-diff reviews.' },
  { question: 'What happens when a question expires?', answer: 'Relay waits for an explicit answer and does not approve for you. A question can expire under its wait limit. Eligible runs can resume and issue a fresh question; rejected gates and safety violations cannot be bypassed through resume. The --yes flag confirms access, never a human gate.' },
  { question: 'Can I use Relay in CI?', answer: 'Yes. Use relay run --ci --yes --json for noninteractive runs and machine-readable results. A human question pauses the run with exit code 10 for local continuation. GitHub Actions gets a job summary, and a bundled pr-review workflow provides advisory AI review. Keep human review before merging.' },
  { question: 'Is every adapter sandboxed on every platform?', answer: 'No. Relay distinguishes permissions enforced by a tool from changes checked afterwards. Codex sandbox mappings are verified on macOS; Linux and Windows are reported as unsandboxed. Claude CLI agents and automated project checks also have unsandboxed boundaries. Read the access summary before confirming.' },
];

function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark${small ? ' brand-mark-small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none">
        <path
          d="M5 18h10.5c4.2 0 5.3-9 10.1-9H31M5 18h10.5c4.2 0 5.3 9 10.1 9H31"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="6" cy="18" r="3" fill="currentColor" />
        <circle cx="30" cy="9" r="3" fill="currentColor" />
        <circle cx="30" cy="27" r="3" fill="currentColor" />
      </svg>
    </span>
  );
}

function App() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButton = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  async function copyCommand(command: string, step: number) {
    window.clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(command);
      setCopiedStep(step);
      setCopyFailed(false);
    } catch {
      setCopiedStep(null);
      setCopyFailed(true);
    }
    copyTimer.current = window.setTimeout(() => {
      setCopiedStep(null);
      setCopyFailed(false);
    }, 2500);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header
        className="site-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && mobileMenuOpen) {
            closeMobileMenu();
            mobileMenuButton.current?.focus();
          }
        }}
      >
        <a className="brand" href="#home" aria-label="Relay home">
          <Mark />
          <span>relay<span className="brand-period">.</span></span>
        </a>
        <nav
          id="main-navigation"
          className={`main-nav${mobileMenuOpen ? ' main-nav-open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#how-it-works" onClick={closeMobileMenu}>How it works</a>
          <a href="#features" onClick={closeMobileMenu}>Features</a>
          <a href="#quickstart" onClick={closeMobileMenu}>Quickstart</a>
          <a href="#commands" onClick={closeMobileMenu}>CLI reference</a>
          <a href={docsUrl} onClick={closeMobileMenu}>Docs</a>
        </nav>
        <button
          ref={mobileMenuButton}
          className="mobile-menu-toggle"
          type="button"
          aria-controls="main-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span aria-hidden="true">{mobileMenuOpen ? '×' : '☰'}</span>
        </button>
        <a className="header-link" href={sourceUrl}>
          Source access
        </a>
      </header>

      <main id="main-content">
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow">Workflow orchestration, in your terminal</div>
            <h1>One AI writes.<br />Another checks.</h1>
            <p className="hero-lede">
              Relay runs a real workflow for AI-assisted engineering: request, story, tasks, code, and review.
              Authors and reviewers have separate roles. You approve the story and the final result.
            </p>
            <div className="hero-actions">
              <a className="button button-lime" href="#quickstart">
                Try the starter workflow
              </a>
              <a className="button button-quiet" href="#how-it-works">
                See how it works
              </a>
            </div>
            <div className="hero-meta">
              <span><i className="meta-node" aria-hidden="true" /> Node.js 22+</span>
              <span><i className="meta-node" aria-hidden="true" /> macOS · Windows · Linux</span>
              <span><i className="meta-node" aria-hidden="true" /> TypeScript</span>
            </div>
          </div>

          <div className="terminal-card" role="group" aria-label="Example Relay workflow configuration">
            <div className="terminal-top">
              <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
              <span>relay.yaml</span>
              <span className="terminal-badge">workflow</span>
            </div>
            <pre className="terminal-code" tabIndex={0} aria-label="Feature workflow configuration; first run relay init --template feature"><code>{`# First: relay init --template feature
imports: [relay://workflows/feature]

budgets:
  max_minutes: 480
  max_turn_minutes: 30

protected:
  - '.github/**'
  - 'db/migrations/**'`}</code></pre>
            <div className="terminal-foot">
              <span><i className="terminal-live" /> Feature workflow configuration</span>
              <span>story · tasks · code review</span>
            </div>
          </div>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
        </section>

        <section className="trust-strip" aria-label="Relay properties">
          <div><span className="strip-icon" aria-hidden="true">⌘</span><span>File-defined workflows</span></div>
          <div><span className="strip-icon" aria-hidden="true">◎</span><span>CLI and direct API agents</span></div>
          <div><span className="strip-icon" aria-hidden="true">◷</span><span>Local run records</span></div>
          <div><span className="strip-icon" aria-hidden="true">⌁</span><span>Cross-platform by design</span></div>
        </section>

        <section className="section-wrap workflow-section" id="how-it-works">
          <div className="section-heading">
            <div>
              <div className="eyebrow eyebrow-dark">The Relay loop</div>
              <h2>From a request<br />to reviewed code.</h2>
            </div>
            <p>
              The bundled feature workflow moves through story reviews, human story approval, a reviewed task list,
              per-task coding, Git-diff review, and final human approval. Each revision needs fresh review.
            </p>
          </div>
          <div className="workflow-steps">
            {workflow.map((step, index) => (
              <article className="workflow-step" key={step.number}>
                <div className="step-top">
                  <span className="step-number">{step.number}</span>
                  {index < workflow.length - 1 && <span className="step-connector" aria-hidden="true">⟶</span>}
                </div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
          <div className="workflow-note">
            <span className="note-icon" aria-hidden="true">↳</span>
            <p><strong>Approval is a decision, not a release.</strong> Confirming access starts the run; it does not approve a story or a gate. Relay never pushes or merges the result.</p>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-wrap">
            <div className="section-heading features-heading">
              <div>
                <div className="eyebrow eyebrow-dark">Built to be understood</div>
                <h2>Coordination without<br />the black box.</h2>
              </div>
              <p>Configuration, permissions, decisions, and run records live alongside your project. Inspect the work, recover eligible interruptions, and set clear limits.</p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.icon}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="quickstart-section section-wrap" id="quickstart">
          <div className="section-heading">
            <div>
              <div className="eyebrow eyebrow-dark">Run your first workflow</div>
              <h2>Start with a<br />working example.</h2>
            </div>
            <div className="access-note">
              <span className="access-lock" aria-hidden="true">⌑</span>
              <p><strong>Source access is currently restricted.</strong><br />Relay’s source repository is private. You’ll need GitHub access to clone or download it.</p>
              <a href={sourceUrl}>Check repository access</a>
            </div>
          </div>
          <div className="quickstart-grid">
            <div className="quickstart-copy">
              <div className="prereq-list">
                <div><span className="prereq-check" aria-hidden="true">✓</span><span><strong>Node.js 22 or newer</strong><small>Check with <code>node --version</code></small></span></div>
                <div><span className="prereq-check" aria-hidden="true">✓</span><span><strong>Git</strong><small>Required for workflows that write files and review git diffs.</small></span></div>
                <div><span className="prereq-check prereq-optional" aria-hidden="true">↗</span><span><strong>AI access is optional for the example</strong><small>The script-only example uses Node. AI workflows need configured CLI logins or API credentials.</small></span></div>
              </div>
              <p className="quickstart-tip"><strong>Start without an AI account.</strong> Build and link Relay, then run the bundled example in a separate scratch folder. The package is private and is not published to npm.</p>
            </div>
            <div className="install-card">
              <div className="install-card-head"><span>Build from source</span><span className="platform-tag">macOS · Windows · Linux</span></div>
              <ol className="install-steps">
                {[
                  { title: 'Clone and enter the project', command: `git clone ${sourceUrl}.git\ncd relay` },
                  { title: 'Build and install the local command', command: 'npm ci\nnpm run build\nnpm link' },
                  { title: 'Create a separate example project', command: 'mkdir ../relay-playground\ncd ../relay-playground\nrelay init --template example' },
                  { title: 'Validate, review access, and run', command: 'relay validate\nrelay run\nrelay status' },
                ].map((step, index) => (
                  <li key={step.title}>
                    <span className="install-number" aria-hidden="true">{index + 1}</span>
                    <div>
                      <div className="install-step-heading">
                        <span>{step.title}</span>
                        <button className="copy-button" onClick={() => copyCommand(step.command, index)} type="button" aria-label={`Copy step ${index + 1}: ${step.title}`}>
                          {copiedStep === index ? 'Copied ✓' : 'Copy'}
                        </button>
                      </div>
                      <pre tabIndex={0} aria-label={`Commands for step ${index + 1}`}><code>{step.command}</code></pre>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="install-card-foot">
                <span>Review the commands and access summary when prompted. The script-only example needs no AI login.</span>
              </div>
              <span className="visually-hidden" role="status">
                {copiedStep !== null ? `Step ${copiedStep + 1} commands copied.` : copyFailed ? 'Could not copy. Select and copy the commands manually.' : ''}
              </span>
            </div>
          </div>
        </section>

        <section className="section-wrap content-section" id="feature-start">
          <div className="section-heading">
            <div><div className="eyebrow eyebrow-dark">Ready for AI-assisted engineering?</div><h2>Bring one feature.<br />Keep the decisions.</h2></div>
            <p>Use an existing Git project with a first commit, a configured commit identity, and no tracked or staged edits. The default feature template uses Claude CLI agents; edit relay.yaml to choose other supported agents and your project’s checks.</p>
          </div>
          <div className="content-panel">
            <h3>Run these commands from your project</h3>
            <pre tabIndex={0}><code>{`relay init --template feature
relay validate
relay run --request "Team managers need to export the filtered task list as CSV. Include task name, owner, and status. Leave scheduled exports out."`}</code></pre>
            <p>Review the generated roles, templates, configuration, and access summary. Read USER_STORY.md at story approval and inspect the run branch at final approval. Checks run project code without a sandbox.</p>
            <a className="text-link" href={productGuideUrl}>Read the guide for product owners, PMs, and designers</a>
          </div>
        </section>

        <section className="features-section" id="agents">
          <div className="section-wrap">
            <div className="section-heading">
              <div><div className="eyebrow eyebrow-dark">Choose your participants</div><h2>CLI tools, API models,<br />scripts, and people.</h2></div>
              <p>Configure each agent’s adapter, model, permissions, and limits in YAML. Reviewers are read-only; use separate agents for authorship and review.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card"><h3>Claude Code & Codex</h3><p>Use claude-cli or codex-cli with existing CLI authentication. Codex requires Git for every workflow. Its sandbox mapping is verified on macOS; Linux and Windows are reported as unsandboxed.</p></article>
              <article className="feature-card"><h3>Direct API adapters</h3><p>Use anthropic-api or openai-compatible-api for supplied-input reviews and declared artifact writing. OpenAI-compatible loopback endpoints support local models without an API key. API agents do not execute local tools.</p></article>
              <article className="feature-card"><h3>Your tools & decisions</h3><p>Use generic-cli for another command-line agent, script for argument-array commands, and human for reviews and gates. Generic CLI agents are reported as unsandboxed and their writes are checked through Git.</p></article>
            </div>
            <p className="section-caption"><a className="text-link" href={`${docsUrl}#permission-mapping`}>Read adapter permissions and platform limits</a></p>
          </div>
        </section>

        <section className="commands-section" id="commands">
          <div className="section-wrap commands-layout">
            <div>
              <div className="eyebrow">At the command line</div>
              <h2>Small CLI.<br />Clear controls.</h2>
              <p>Start, inspect, and stop workflows without leaving the terminal. Relay gives you a summary before execution and a review loop after it.</p>
            </div>
            <div className="command-list">
              {commands.map(([command, description]) => (
                <div className="command-row" key={command}>
                  <code>{command}</code><span>{description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="safety-section section-wrap" id="safety">
          <div className="safety-mark"><Mark small /></div>
          <div className="safety-copy">
            <div className="eyebrow eyebrow-dark">Human in the loop</div>
            <h2>Know what runs.<br />Decide what proceeds.</h2>
            <p>
              Review Relay’s access summary before starting. A reserved confirmation digest binds that summary to the run. The summary shows
              commands, the working directory, agent permissions, protected patterns, and sandbox status. Enforcement and post-turn checks are labeled separately.
            </p>
          </div>
          <div className="safety-list">
            <div><span aria-hidden="true">↗</span><p><strong>Review the access summary</strong><small>Commands, workdir, git status, and agent permissions before execution.</small></p></div>
            <div><span aria-hidden="true">◷</span><p><strong>Understand spend limits</strong><small>Recorded spend is checked between turns. Unmetered agents and unknown usage make totals partial; token-based pricing needs explicit model rates.</small></p></div>
            <div><span aria-hidden="true">◎</span><p><strong>Choose CLI or API access</strong><small>CLI agents use existing logins. API agents send supplied inputs to the configured host with a key from an environment variable.</small></p></div>
            <div><span aria-hidden="true">!</span><p><strong>Know the boundary</strong><small>Protected paths stop or detect writes; they do not prevent reads or data transmission. Project checks execute code without a sandbox.</small></p></div>
          </div>
        </section>

        <section className="section-wrap content-section" id="claude-plugin">
          <div className="section-heading">
            <div>
              <div className="eyebrow eyebrow-dark">Claude Code plugin</div>
              <h2>Keep the workflow<br />under your control.</h2>
            </div>
            <p>
              Relay includes a Claude Code plugin with slash-command skills for requesting work, starting a run, and answering gates.
              Its hook guards Relay state and asks for human authorization for decision commands. Run, answer, and resume must be invoked by the human.
            </p>
          </div>
          <div className="content-panel">
            <h3>Install the plugin after building and linking the CLI</h3>
            <pre tabIndex={0}><code>{`/plugin marketplace add mojtabafazeli/relay
/plugin install relay@relay`}</code></pre>
            <p>Use <code>/relay:init</code> to configure, <code>/relay:request</code> to save a request, and <code>/relay:run</code> to review access and start a background run. Follow progress and pending questions with <code>/relay:status</code>; respond with <code>/relay:answer</code>, stop with <code>/relay:stop</code>, or recover an eligible interruption with <code>/relay:resume</code>.</p>
            <p>Closing chat does not stop a background run. Poll status for questions; there are no push notifications. Windows requires Git Bash for the plugin hook. Plugin assets are installed separately from the CLI package.</p>
            <a className="text-link" href={`${docsUrl}#claude-code-plugin`}>Read plugin setup and enforcement limits</a>
          </div>
        </section>

        <section className="features-section" id="ci">
          <div className="section-wrap">
            <div className="section-heading">
              <div><div className="eyebrow eyebrow-dark">Available now · CI</div><h2>Review in your pipeline.<br />Keep humans in charge.</h2></div>
              <p>Noninteractive runs produce JSON results and GitHub Actions job summaries. The bundled pr-review workflow reviews a committed diff without creating a branch or commit.</p>
            </div>
            <div className="content-panel">
              <h3>Example: reviewers-only PR workflow</h3>
              <pre tabIndex={0}><code>{`relay run --ci --yes --json --var base=origin/main relay://workflows/pr-review > relay-result.json`}</code></pre>
              <p>Requires Git, the base ref, and ANTHROPIC_API_KEY. The bundled reviewer uses the Anthropic API with a USD 2 budget checked between turns and example pricing you should review. An empty diff fails; a human question pauses a CI run with exit code 10 for local continuation.</p>
              <p><strong>AI review is advisory.</strong> Diff content can mislead the model. Keep human review, never use the result to drive auto-merge, and use the documented pull_request setup for GitHub Actions.</p>
              <a className="text-link" href={`${sourceUrl}/blob/main/examples/github-actions/relay-pr-review.yml`}>View the GitHub Actions example</a>
            </div>
          </div>
        </section>

        <section className="section-wrap content-section" id="roadmap">
          <div className="section-heading">
            <div>
              <div className="eyebrow eyebrow-dark">What’s next</div>
              <h2>Still on the roadmap.</h2>
            </div>
            <p>The CLI and Claude Code plugin are the current front ends. The browser UI is the next planned front end; external adapter discovery is deferred until after v1.</p>
          </div>
          <div className="feature-grid roadmap-grid">
            {roadmap.map((item) => (
              <article className="feature-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap faq-section" id="faq">
          <div className="section-heading">
            <div>
              <div className="eyebrow eyebrow-dark">FAQ</div>
              <h2>Questions teams ask.</h2>
            </div>
          </div>
          <div className="faq-list">
            {faqs.map((item) => (
              <div className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-pattern" aria-hidden="true" />
          <div className="final-cta-inner">
            <Mark />
            <div className="eyebrow">Your workflow, clearly defined</div>
            <h2>Request.<br /><span>Review.</span> Decide what ships.</h2>
            <p>Start with the script-only example, then configure a reviewed feature workflow for your project.</p>
            <a className="button button-lime" href={sourceUrl}>
              Open the source repository
            </a>
            <span className="private-caption">Repository access is currently required to download the source.</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home"><Mark small /><span>relay<span className="brand-period">.</span></span></a>
        <span>File-defined workflows for AI agents, scripts, and people.</span>
        <a href={sourceUrl}>GitHub</a>
      </footer>
    </>
  );
}

export default App;
