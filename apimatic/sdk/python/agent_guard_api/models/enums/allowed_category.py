from enum import Enum
from typing import Annotated, TypeAlias

from ...core import open_enum_validator


class AllowedCategory(str, Enum):
    PHYSICAL_GOODS = "PHYSICAL_GOODS"
    DIGITAL_GOODS = "DIGITAL_GOODS"
    DONATION = "DONATION"
    UNSPECIFIED = "UNSPECIFIED"

    __str__ = str.__str__


AllowedCategoryOrStr: TypeAlias = Annotated[AllowedCategory | str, open_enum_validator(AllowedCategory)]
