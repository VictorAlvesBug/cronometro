import { createMachine, actions } from 'xstate';

const { assign: sharedAssign } = actions;

type TEstado = 'zerado' | 'rodando' | 'pausado';

export type TContexto = {
    estado: TEstado;
    segundos: number;
};

export type TEnviar = (acao: 'RODAR' | 'PARAR' | 'ZERAR') => void;

const incrementoSegundos = 1 / 64;

const cronometroMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGMBOB7AdugtmALhgHQBeYqAhhOgMQCSAcnQMJ0CCASgNoAMAuolAAHdLACW+MVkEgAHogAsAJgCcRAKwBmAIxL1AGhABPRNoDsADiJn1AX1uG0WXAWIYIFTNRoAFTp14BJBARcUlpYPkEBU0ANiJNJQtdA2NFWLN7RwxsPEJ0IndPbwAtAFEOAP4ZUIkpTBkomLMNWL1DEwRkjSyQJ1zXAqEKAFdYKlpmAHkGABVGAFUqoOFROojQKO1YqxsOxESlIgsbXv6XfKJhsYmacsruauDa8IbI0x3rVM6Toh4LTSAoHAzQKewOEDYCBwGTnPIYGprV6NRAAWli+wQ6LOOQuxDIlGoiLC9RRCB0LS0KUx2m0PCIKnUAJBwLBELhg0K6A8XnQxPWb02iHUIuOKh4bW+iCUPBaKlO7Nx8KGo3GROeSNJ72iShpSm0xxZLLZ9iAA */
    id: 'cronometro',
    predictableActionArguments: true,
    initial: 'zerado',
    context: {
        estado: 'zerado',
        segundos: 0,
        //loop: null
    } as TContexto,
    states: {
        zerado: {
            on: {
                RODAR: {
                    target: 'rodando',
                    actions: 'rodar'
                }
            }
        },
        rodando: {
            invoke: {
            src: (context) => (cb) => {
              const interval = setInterval(() => {
                cb('TICK');
              }, 1000 * incrementoSegundos);
    
              return () => {
                clearInterval(interval);
              };
            }
          },
            on: {
                PARAR: {
                    target: 'pausado',
                    actions: 'parar'
                },
                ZERAR: {
                    target: 'zerado',
                    actions: 'zerar'
                },
                TICK: {
                    actions: 'tick'
                }
            }
        },
        pausado: {
            on: {
                RODAR: {
                    target: 'rodando',
                    actions: 'rodar'
                },
                ZERAR: {
                    target: 'zerado',
                    actions: 'zerar'
                }
            }
        },
    }
},{
    actions: {
        rodar: sharedAssign({
            estado: _ => 'rodando' as TEstado,
          }),
        parar: sharedAssign({
            estado: _ => 'pausado' as TEstado,
          }),
        zerar: sharedAssign({
            estado: _ => 'zerado' as TEstado,
            segundos: _ => 0
          }),
        tick: sharedAssign({
            segundos: (context) => {
                return context.segundos + incrementoSegundos
            }
          }),
    }
});

export default cronometroMachine;
