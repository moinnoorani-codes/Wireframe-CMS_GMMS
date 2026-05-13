import { ROLE_COLORS, ERP_COLORS, getFlowsForScreen, getFlowNavigation, getFlowById, getStepIndexByScreen } from "./flows-data";

// ─── Color Palette (matches App.jsx C) ───────────────────────────
const palette = {
  bgSoft: "#f5f5f5", text: "#111111", textMuted: "#666666", textLight: "#999999",
  border: "#e0e0e0", red: "#c0392b", redLight: "#fdf0ef", redBorder: "#e8b4b0",
  black: "#111111", white: "#ffffff", green: "#1a7a4a", greenLight: "#edf7f1", greenBorder: "#a8d5bc",
};

// ─── RoleBadge ───────────────────────────────────────────────────
export function RoleBadge({ role, size }) {
  const colors = ROLE_COLORS[role] || { bg: "#eee", fg: "#555" };
  const s = size === "sm" ? 9 : 10;
  return (
    <span style={{
      display: "inline-block", fontSize: s, fontWeight: 600, letterSpacing: "0.03em",
      padding: size === "sm" ? "1px 5px" : "2px 7px", borderRadius: 3,
      background: colors.bg, color: colors.fg, whiteSpace: "nowrap",
    }}>{role}</span>
  );
}

// ─── FlowTag ─────────────────────────────────────────────────────
export function FlowTag({ flowId, flowName, erp, active, onClick }) {
  const ec = ERP_COLORS[erp] || ERP_COLORS.sales;
  return (
    <span onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 10, fontWeight: 600, letterSpacing: "0.03em",
      padding: "2px 7px", borderRadius: 3, cursor: onClick ? "pointer" : "default",
      background: active ? ec.accent : ec.light,
      color: active ? "#fff" : ec.accent,
      border: `0.5px solid ${active ? ec.accent : ec.border}`,
      whiteSpace: "nowrap",
    }}>
      {flowName}
    </span>
  );
}

// ─── FlowBar ─────────────────────────────────────────────────────
export function FlowBar({ flow, currentStep, stepIndex, totalSteps, onPrev, onNext, onDiagram, onExit }) {
  const ec = ERP_COLORS[flow.erp] || ERP_COLORS.sales;
  return (
    <div style={{
      border: `0.5px solid ${ec.border}`, borderRadius: 6, marginBottom: 12,
      background: ec.light, overflow: "hidden",
    }}>
      {/* Top row: flow name + step counter + exit */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 12px", background: ec.accent, color: "#fff",
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, flex: 1 }}>
          {flow.name}
        </span>
        <span style={{ fontSize: 10, opacity: 0.85 }}>
          Step {stepIndex + 1} / {totalSteps}
        </span>
        <span onClick={onExit} style={{
          fontSize: 14, cursor: "pointer", opacity: 0.7, lineHeight: 1,
        }}>×</span>
      </div>
      {/* Bottom row: step label + nav */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 12px",
      }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: palette.text }}>
            {currentStep.label}
          </div>
          {currentStep.desc && (
            <div style={{ fontSize: 10, color: palette.textMuted, fontStyle: "italic" }}>
              {currentStep.desc}
            </div>
          )}
        </div>
        <RoleBadge role={currentStep.role} size="sm" />
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={onPrev} disabled={stepIndex === 0} style={{
            padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: stepIndex === 0 ? "default" : "pointer",
            border: `0.5px solid ${palette.border}`, borderRadius: 3,
            background: stepIndex === 0 ? palette.bgSoft : palette.white,
            color: stepIndex === 0 ? palette.textLight : palette.text,
            opacity: stepIndex === 0 ? 0.5 : 1,
          }}>{"\u2190"} Prev</button>
          <button onClick={onNext} disabled={stepIndex >= totalSteps - 1} style={{
            padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: stepIndex >= totalSteps - 1 ? "default" : "pointer",
            border: `0.5px solid ${palette.border}`, borderRadius: 3,
            background: stepIndex >= totalSteps - 1 ? palette.bgSoft : palette.white,
            color: stepIndex >= totalSteps - 1 ? palette.textLight : palette.text,
            opacity: stepIndex >= totalSteps - 1 ? 0.5 : 1,
          }}>Next {"\u2192"}</button>
        </div>
        <span onClick={onDiagram} style={{
          fontSize: 10, color: ec.accent, cursor: "pointer", fontWeight: 600,
          padding: "4px 8px", borderRadius: 3, border: `0.5px solid ${ec.border}`,
          background: palette.white, whiteSpace: "nowrap",
        }}>View Diagram</span>
      </div>
    </div>
  );
}

// ─── FlowDiagram (Modal) ─────────────────────────────────────────
export function FlowDiagram({ flow, currentStepIndex, onNavigate, onClose }) {
  const ec = ERP_COLORS[flow.erp] || ERP_COLORS.sales;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}>
      <div style={{
        width: 580, maxHeight: "85%", background: palette.white, borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)", overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 18px", borderBottom: `0.5px solid ${palette.border}`, flexShrink: 0,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <span>Flow: {flow.name}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3,
              background: ec.light, color: ec.accent,
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>{flow.erp === "cross" ? "Cross-ERP" : flow.erp}</span>
          </div>
          <span onClick={onClose} style={{
            fontSize: 20, color: palette.textMuted, cursor: "pointer", lineHeight: 1,
          }}>×</span>
        </div>
        {/* Flow description */}
        {flow.description && (
          <div style={{
            fontSize: 11, color: palette.textMuted, padding: "8px 18px",
            borderBottom: `0.5px solid ${palette.border}`, background: palette.bgSoft,
          }}>
            {flow.description}
          </div>
        )}
        {/* Steps as connected nodes */}
        <div style={{
          padding: "20px 18px", overflowY: "auto", flex: 1,
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {flow.steps.map((step, i) => {
            const isCurrent = i === currentStepIndex;
            const isPast = i < currentStepIndex;
            const isCross = step.crossErp;
            const stepEc = isCross ? ERP_COLORS.cross : ec;
            return (
              <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                {/* Connector line + dot */}
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  width: 32, flexShrink: 0,
                }}>
                  {i > 0 && <div style={{
                    width: 2, flex: 1,
                    background: isPast ? stepEc.accent : palette.border,
                  }} />}
                  <div onClick={() => onNavigate(step.screen)} style={{
                    width: 22, height: 22, borderRadius: "50%", cursor: "pointer",
                    background: isCurrent ? stepEc.accent : isPast ? stepEc.light : palette.bgSoft,
                    border: `2px solid ${isCurrent ? stepEc.accent : stepEc.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: isCurrent ? "#fff" : stepEc.accent,
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  {i < flow.steps.length - 1 && <div style={{
                    width: 2, flex: 1,
                    background: isPast ? stepEc.accent : palette.border,
                  }} />}
                </div>
                {/* Step card */}
                <div onClick={() => onNavigate(step.screen)} style={{
                  flex: 1, marginLeft: 10, marginBottom: i < flow.steps.length - 1 ? 4 : 0,
                  padding: "8px 12px", borderRadius: 5, cursor: "pointer",
                  background: isCurrent ? stepEc.light : palette.white,
                  border: `0.5px solid ${isCurrent ? stepEc.accent : palette.border}`,
                  boxShadow: isCurrent ? `0 0 0 1px ${stepEc.accent}40` : "none",
                  transition: "all 0.1s",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: palette.text,
                      flex: 1,
                    }}>{step.label}</span>
                    <span style={{
                      fontSize: 9, fontFamily: "monospace", color: palette.textMuted,
                    }}>{step.screen}</span>
                    {isCross && (
                      <span style={{
                        fontSize: 8, fontWeight: 700, padding: "1px 4px", borderRadius: 2,
                        background: "#f3e8ff", color: "#7c3aed",
                        textTransform: "uppercase", letterSpacing: "0.04em",
                      }}>Cross-ERP</span>
                    )}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, marginTop: 3,
                  }}>
                    <RoleBadge role={step.role} size="sm" />
                    {step.desc && (
                      <span style={{ fontSize: 10, color: palette.textMuted, fontStyle: "italic" }}>
                        {step.desc}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Footer */}
        <div style={{
          padding: "10px 18px", borderTop: `0.5px solid ${palette.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0, background: palette.bgSoft,
        }}>
          <span style={{ fontSize: 10, color: palette.textMuted }}>
            Click any step to navigate
          </span>
          <button onClick={onClose} style={{
            padding: "5px 14px", fontSize: 11, fontWeight: 600,
            border: `0.5px solid ${palette.border}`, borderRadius: 3,
            background: palette.white, cursor: "pointer",
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── FlowNavButtons ──────────────────────────────────────────────
export function FlowNavButtons({ prevStep, nextStep, screenId, onNavigate, onStartFlow }) {
  const relatedFlows = getFlowsForScreen(screenId);
  const hasPrev = prevStep && prevStep.screen !== screenId;
  const hasNext = nextStep && nextStep.screen !== screenId;

  return (
    <div style={{
      marginTop: 20, paddingTop: 14,
      borderTop: `0.5px solid ${palette.border}`,
    }}>
      {/* Prev / Next flow navigation */}
      {(hasPrev || hasNext) && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {hasPrev && (
            <button onClick={() => onNavigate(prevStep.screen)} style={{
              flex: 1, padding: "10px 14px", borderRadius: 5, cursor: "pointer",
              border: `0.5px solid ${palette.border}`,
              background: palette.white, textAlign: "left",
              display: "flex", flexDirection: "column",
            }}>
              <span style={{ fontSize: 9, color: palette.textMuted, marginBottom: 2 }}>
                {"\u2190"} Previous in Flow
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: palette.text }}>
                {prevStep.label}
              </span>
            </button>
          )}
          {hasNext && (
            <button onClick={() => onNavigate(nextStep.screen)} style={{
              flex: 1, padding: "10px 14px", borderRadius: 5, cursor: "pointer",
              border: `0.5px solid ${palette.border}`,
              background: palette.white, textAlign: "right",
              display: "flex", flexDirection: "column",
            }}>
              <span style={{ fontSize: 9, color: palette.textMuted, marginBottom: 2 }}>
                Next in Flow {"\u2192"}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: palette.text }}>
                {nextStep.label}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Related flows */}
      {relatedFlows.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: palette.textMuted, fontWeight: 600 }}>
            Also part of:
          </span>
          {relatedFlows.map(f => (
            <span
              key={f.id}
              onClick={() => onStartFlow && onStartFlow(f.id, screenId)}
              style={{
                fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 3, cursor: "pointer",
                background: ERP_COLORS[f.erp]?.light || palette.bgSoft,
                color: ERP_COLORS[f.erp]?.accent || palette.textMuted,
                border: `0.5px solid ${ERP_COLORS[f.erp]?.border || palette.border}`,
              }}
            >
              {f.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
