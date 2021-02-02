// Types
import Dictionary from '../types/dictionary';

abstract class BaseAction {
	abstract handle(inputs?: Dictionary<any>, options?: Dictionary<any>): void;
}

export default BaseAction;
